class Parser {
    constructor(langs) {
        // Storage
        this.langsPrefer = langs
        this.themeName = 'atom-one-dark'
        this.isAutoParse = false

        this.themeManager = new ThemeManager()

        this.preEls = Array.from(document.querySelectorAll('pre'))

        this.linkEl = null

        this.codeBlocks = []
        // Cache each element innerHTML for reverting
        this.preElsCache = []
        // Pre-process <pre/> elements
        this.preprocess()

        this.init()
    }

    init() {
        // Cache for revert
        this.cachePreElsContent()

        // Get default theme and invoke corresponding CSS file
        this.getDefaultThemeName()

        // Get default langs preference
        this.getDefaultLangsPrefer()

        this.bindEvent()

        // Get default auto parse
        this.getDefaultAutoParse()
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

    preprocess() {
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
            console.log('Theme currently is ' + this.themeName);
        });
    }

    getDefaultLangsPrefer() {
        chrome.storage.sync.get(['langsPrefer'], (result) => {
            this.langsPrefer = result.langsPrefer ? result.langsPrefer : this.langsPrefer

            // Sort
            this.sortLangsPrefer()
            console.log('Langs preference is ' + this.langsPrefer.map((langPrefer) => langPrefer.value));

            // Register language preference to hljs
            this.setAutoDetectLangs()
        });
    }

    setThemeName(themeName) {
        this.themeName = themeName
        chrome.storage.sync.set({themeName: this.themeName}, () => {
            console.log('Theme is set to ' + this.themeName);
        });
    }

    setLangsPrefer(langsPrefer) {
        this.langsPrefer = langsPrefer
        chrome.storage.sync.set({langsPrefer: this.langsPrefer}, () => {
            console.log('Langs preference is set to ' + this.langsPrefer.map(((langPrefer) => langPrefer.value)));
            // Register language preference to hljs
            this.setAutoDetectLangs()
        });
    }

    switchTheme(themeName) {
        // Switch to corresponding CSS file
        let href = chrome.runtime.getURL(`lib/highlight/styles/${themeName}.css`)
        this.linkEl && this.linkEl.setAttribute('href', href)

        // Switch to corresponding theme properties
        this.themeManager.getProperties((properties) => {
            this.codeBlocks.forEach((codeBlock) => {
                codeBlock.codeEl.style.backgroundColor = properties.backgroundColor
            })
        })
    }

    // Receive msg from popup.js
    bindEvent() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            switch (request.eventName) {
                case 'parse':
                    console.log('Parsing this article');
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
            languages: this.langsPrefer.map((langPrefer) => langPrefer.value)
        })
    }

    // Revert to original styles
    revert() {
        for (let i = 0; i < this.preEls.length; i++) {
            this.preEls[i].removeAttribute('data-highlight')
            // Check content type
            if (typeof this.preElsCache[i] === 'string') {
                this.preEls[i].innerText = this.preElsCache[i]
            }
            else {
                this.preEls[i].innerHTML = ''
                this.preEls[i].appendChild(this.preElsCache[i])
            }
        }

        this.removeLinkEl()
    }

    removeLinkEl() {
        this.linkEl.remove()
        this.linkEl = null
    }

    // Parse the whole page
    parse() {
        if (!this.linkEl) {
            this.initThemeCSS()
        }
        // test
        this.themeManager.getProperties((properties) => {
            this.codeBlocks = this.preEls.map((preEl) => {
                // Each time get a new Code Block
                return new CodeBlock(preEl, this.langsPrefer, properties)
            })
        })
    }

    sortLangsPrefer() {
        this.langsPrefer.sort((langA, langB) => {
            return langB.value.length - langA.value.length
        })
    }
}
