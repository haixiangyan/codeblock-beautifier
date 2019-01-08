class Parser {
    constructor(langs) {
        // Storage
        this.langsPrefer = langs
        this.themeName = 'atom-one-dark'
        this.isAutoParse = false

        this.themeManager = new ThemeManager()

        this.preEls = []

        this.linkEl = null

        this.codeBlocks = []
        // Cache each element innerHTML for reverting
        this.preElsCache = []

        this.isParsed = false

        this.init()
    }

    init() {
        // // To get preEls and cache them
        // this.prepareCodeBlocks()

        // Get default theme and invoke corresponding CSS file
        this.getDefaultThemeName()

        // Get default langs preference
        this.getDefaultLangsPrefer()

        this.bindEvent()

        // Get default auto parse
        this.getDefaultAutoParse()
    }

    prepareCodeBlocks() {
        this.preEls = Array.from(document.querySelectorAll('pre'))

        // Pre-process <pre/> elements
        this.mixinPreEls()

        // Cache for revert
        this.cachePreElsContent()
    }

    cachePreElsContent() {
        this.preEls.forEach((preEl) => {
            // Contain <code/>
            if (preEl.firstElementChild && preEl.firstElementChild.tagName === 'CODE') {
                this.preElsCache.push(preEl.firstElementChild.cloneNode(true))
            }
            else {
                this.preElsCache.push(preEl.innerText)
            }
        })
    }

    // Create a <link/> and set CSS file path according to default theme
    initThemeCSS() {
        this.linkEl = document.createElement('link')
        this.linkEl.setAttribute('rel', 'stylesheet')
        this.linkEl.setAttribute('data-highlight', true)

        // Set default theme
        this.switchTheme(this.themeName)

        document.querySelector('head').appendChild(this.linkEl)
    }

    mixinPreEls() {
        // Mixin relative <pre/> elements
        let miner = new Mixiner()
        miner.elsMixin(this.preEls)
    }

    getDefaultAutoParse() {
        chrome.storage.sync.get(['isAutoParse'], (result) => {
            this.isAutoParse = result.isAutoParse || false
            if (this.isAutoParse) {
                this.parse()
            }
        });
    }

    getDefaultThemeName() {
        chrome.storage.sync.get(['themeName'], (result) => {
            this.themeName = result.themeName || 'atom-one-dark'
        });
    }

    getDefaultLangsPrefer() {
        chrome.storage.sync.get(['langsPrefer'], (result) => {
            this.langsPrefer = result.langsPrefer ? result.langsPrefer : this.langsPrefer

            // Sort
            this.sortLangsPrefer()

            // Register language preference to hljs
            this.setAutoDetectLangs()
        })
    }

    setThemeName(themeName) {
        this.themeName = themeName
        chrome.storage.sync.set({themeName: this.themeName}, () => { });
    }

    setLangsPrefer(langsPrefer) {
        this.langsPrefer = langsPrefer
        chrome.storage.sync.set({langsPrefer: this.langsPrefer}, () => {
            // Register language preference to hljs
            this.setAutoDetectLangs()
        });
    }

    setCodeBlockBg() {
        // Switch to corresponding theme properties
        this.themeManager.getStylesByClassName('hljs', (computedStyles) => {
            this.codeBlocks.forEach((codeBlock) => {
                codeBlock.codeEl.style.backgroundColor = computedStyles.backgroundColor
            })
        })
    }

    switchTheme(themeName) {
        // Switch to corresponding CSS file
        let href = chrome.runtime.getURL(`lib/highlight/styles/${themeName}.css`)
        this.linkEl && this.linkEl.setAttribute('href', href)

        this.setCodeBlockBg()
    }

    applyNewLangsPrefer() {
        if (this.isParsed) {
            this.revert()
            this.parse()
        }
    }

    // Receive msg from main.js
    bindEvent() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            switch (request.eventName) {
                case 'parse':
                    this.parse()
                    break
                case 'revert':
                    this.revert()
                    break
                case 'switchThemeName':
                    this.switchTheme(request.themeName)
                    this.setThemeName(request.themeName)
                    break
                case 'switchLangsPrefer':
                    this.setLangsPrefer(request.langsPrefer)
                    break
            }
        });
    }

    // Register language preference to hljs
    setAutoDetectLangs() {
        hljs.configure({
            languages: this.langsPrefer.map((langPrefer) => langPrefer.className)
        })

        this.applyNewLangsPrefer()
    }

    // Revert to original styles
    revert() {
        // If it's not parsed, then do nothing
        if (!this.isParsed) {
            return
        }

        for (let i = 0; i < this.preEls.length; i++) {
            this.preEls[i].removeAttribute('data-highlight')
            // Check content type
            if (typeof this.preElsCache[i] === 'string') {
                this.preEls[i].innerText = this.preElsCache[i]
            }
            else {
                this.preEls[i].innerHTML = ''
                this.preEls[i].appendChild(this.preElsCache[i].cloneNode(true))
            }
        }

        this.removeLinkEl()
        this.isParsed = false
    }

    removeLinkEl() {
        if (this.linkEl) {
            this.linkEl.remove()
            this.linkEl = null
        }
    }

    // Parse the whole page
    parse() {
        // If it's already been parsed then do nothing
        if (this.isParsed) {
            return
        }
        // If no theme css link, then create it
        if (!this.linkEl) {
            this.initThemeCSS()
        }
        // If no preEls, then get them and cache them
        if (this.preEls.length === 0) {
            this.prepareCodeBlocks()
        }
        // Get .hljs computed styles
        this.themeManager.getStylesByClassName('hljs', (computedStyles) => {
            this.codeBlocks = this.preEls.map((preEl) => {
                // Each time get a new Code Block
                return new CodeBlock(preEl, this.langsPrefer, computedStyles)
            })
        })
        this.isParsed = true
    }

    sortLangsPrefer() {
        this.langsPrefer.sort((langA, langB) => {
            return langB.className.length - langA.className.length
        })
    }
}
