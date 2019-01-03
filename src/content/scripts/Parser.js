class Parser {
    constructor(langs) {
        this.langs = langs
        this.linkEl = document.createElement('link')
        this.preEls = Array.from(document.querySelectorAll('pre'))
        // Pre-process <pre/> elements
        this.preprocess()

        this.themeName = 'atom-one-dark'

        this.init()
    }

    init() {
        // Get default theme and invoke corresponding CSS file
        this.getDefaultTheme()

        this.bindEvent()
    }

    // Create a <link/> and set CSS file path according to default theme
    initThemeTag() {
        this.linkEl.setAttribute('rel', 'stylesheet')

        // Set default theme
        this.switchTheme(this.themeName)

        document.querySelector('head').appendChild(this.linkEl)
    }

    preprocess() {
        // Mixin relative <pre/> elements
        let miner = new Mixiner()
        miner.elsMixin(this.preEls)
    }

    getDefaultTheme() {
        chrome.storage.sync.get(['themeName'], (result) => {
            console.log('Theme currently is ' + result.themeName);
            this.themeName = result.themeName || 'atom-one-dark'
            this.initThemeTag()
        });
    }

    setDefaultTheme(themeName) {
        this.themeName = themeName
        chrome.storage.sync.set({themeName: this.themeName}, () => {
            console.log('Theme is set to ' + this.themeName);
        });
    }

    setLangPrefer(langs) {
    }

    switchTheme(themeName) {
        let href = chrome.runtime.getURL(`lib/highlight/styles/${themeName}.css`)
        this.linkEl.setAttribute('href', href)
    }

    // Receive msg from popup.js
    bindEvent() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            switch (request.eventName) {
                case 'parse':
                    console.log('Starting to parse this article');
                    this.parse()
                    break
                case 'switchTheme':
                    console.log('Switching theme')
                    this.switchTheme(request.themeName)
                    this.setDefaultTheme(request.themeName)
                    break
                case 'setLangs':
                    console.log('Your language preference is set')
                    break;
            }
        });
    }

    // Parse the whole page
    parse() {
        this.preEls.map((preEl) => {
            // Each time get a new Code Block
            return new CodeBlock(preEl, this.langs)
        })
    }
}
