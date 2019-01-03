class Parser {
    constructor(langs) {
        this.langsPrefer = langs

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

        // Get default langs preference
        this.getDefaultLangsPrefer()

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
            this.themeName = result.themeName || 'atom-one-dark'
            console.log('Theme currently is ' + this.themeName);
            this.initThemeTag()
        });
    }

    getDefaultLangsPrefer() {
        chrome.storage.sync.get(['langsPrefer'], (result) => {
            this.langsPrefer = result.langsPrefer ? result.langsPrefer : this.langsPrefer
            console.log('Langs preference is ' + this.langsPrefer);
        });
    }

    setThemeName(themeName) {
        this.themeName = themeName
        chrome.storage.sync.set({themeName: this.themeName}, () => {
            console.log('Theme is set to ' + this.themeName);
        });
    }

    setLangPrefer(langsPrefer) {
        this.langsPrefer = langsPrefer
        chrome.storage.sync.set({langs: this.langsPrefer}, () => {
            console.log('Langs preference is set to ' + this.langsPrefer);
        });
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
                    console.log('Parsing this article');
                    this.parse()
                    break
                case 'switchTheme':
                    this.switchTheme(request.themeName)
                    this.setThemeName(request.themeName)
                    break
                case 'setLangsPrefer':
                    this.setLangPrefer(request.langsPrefer)
                    break;
            }
        });
    }

    // Parse the whole page
    parse() {
        this.preEls.map((preEl) => {
            // Each time get a new Code Block
            return new CodeBlock(preEl, this.langsPrefer)
        })
    }
}
