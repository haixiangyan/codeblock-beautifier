class Parser {
    constructor(langs) {
        this.langs = langs
        this.linkEl = document.createElement('link')
        this.preEls = Array.from(document.querySelectorAll('pre'))
        // Pre-process <pre/> elements
        this.preprocess()

        this.defaultTheme = 'atom-one-dark'

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
        this.switchTheme(this.defaultTheme)

        document.querySelector('head').appendChild(this.linkEl)
    }

    preprocess() {
        // Mixin relative <pre/> elements
        let miner = new Mixiner()
        miner.elsMixin(this.preEls)
    }

    getDefaultTheme() {
        chrome.storage.sync.get(['theme'], (result) => {
            console.log('Theme currently is ' + result.theme);
            this.defaultTheme = result.theme || 'atom-one-dark'
            this.initThemeTag()
        });
    }

    setDefaultTheme(themeName) {
        this.defaultTheme = themeName
        chrome.storage.sync.set({theme: this.defaultTheme}, () => {
            console.log('Theme is set to ' + this.defaultTheme);
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
                    console.log('Starting to parse this article');
                    this.parse()
                    sendResponse({result: 'Finish'});
                    break
                case 'switchTheme':
                    console.log('Switching theme')
                    this.switchTheme(request.themeName)
                    this.setDefaultTheme(request.themeName)
                    sendResponse({result: 'Finish'})
                    break
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
