class SelectionPanel {
    constructor(preEl, codeEl) {
        this.preEl = preEl
        this.codeEl = codeEl
        this.lang = this.codeEl.classList[1]
        this.panel = this.generatePanelEl()
        this.langSelector = this.generateLangSelector()

        this.init()
    }

    init() {
        this.panel.appendChild(this.langSelector)

        this.bindEvents()
    }

    generatePanelEl() {
        return document.createElement('div')
    }

    generateLangSelector() {
        let langSelectEl = document.createElement('select')

        // From langs.js, building options for <select/>
        langs.forEach((selection) => {
            let optionEl = document.createElement('option')
            optionEl.setAttribute('value', selection.value)
            optionEl.selected = (this.lang === selection.value)
            optionEl.innerText = selection.text

            langSelectEl.appendChild(optionEl)
        })

        return langSelectEl
    }

    bindEvents() {
        this.langSelector.addEventListener('change', (event) => {
            // Update highlight language
            this.codeEl.setAttribute('class', `hljs ${event.target.value}`)
            // Rewrite codes in <code/>
            this.codeEl.innerText = this.codeEl.innerText
            // Highlight the new code element
            hljs.highlightBlock(this.codeEl)
        })
    }
}

class CodeBlock {
    constructor(preEl) {
        this.preEl = preEl
        this.codeEl = this.generateCodeEl(preEl)
        this.selectionPanel = null

        this.init()
    }

    init() {
        this.rebuildPreEl()
    }

    rebuildPreEl() {
        this.wrapCodeEl()

        hljs.highlightBlock(this.codeEl)

        // Init selection panel
        this.selectionPanel = new SelectionPanel(this.preEl, this.codeEl)
        this.wrapPanelEl()
    }

    generateCodeEl(preEl) {
        let codeEl = document.createElement('code')
        codeEl.setAttribute('data-highlight', true)
        codeEl.innerText = preEl.innerText

        return codeEl
    }

    wrapCodeEl() {
        this.preEl.setAttribute('data-highlight', true)
        this.preEl.innerHTML = ''
        this.preEl.appendChild(this.codeEl)
    }

    wrapPanelEl() {
        this.preEl.appendChild(this.selectionPanel.panel)
    }
}

class Mixiner {
    elsMixin(els) {
        let index = 0;

        while (index < els.length) {
            this.mixin(els, els[index], index + 1);
            index = index + 1;
        }
    }

    mixin(els, curEl, nextIndex) {
        // Out of bound
        if (nextIndex >= els.length) {
            return;
        }
        // Not continuous
        if (curEl.nextElementSibling !== els[nextIndex]) {
            return;
        }

        // Recursion
        this.mixin(els, els[nextIndex], nextIndex + 1);

        // Mixin (Start from the last second one)
        curEl.innerText += "\n" + els[nextIndex].innerText;

        // Remove the next element
        els[nextIndex].remove();
        els.splice(nextIndex, 1);
    }
}

class Parser {
    constructor() {
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

    initThemeTag() {
        this.linkEl.setAttribute('rel', 'stylesheet')

        // Set default theme
        this.switchTheme(this.defaultTheme)

        document.querySelector('head').appendChild(this.linkEl)
    }

    preprocess() {
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

    parse() {
        this.preEls.map((preEl) => {
            return new CodeBlock(preEl)
        })
    }
}



new Parser()
