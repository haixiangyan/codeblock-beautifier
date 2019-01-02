class SelectionPanel {
    constructor(preEl, codeEl, langs) {
        this.preEl = preEl
        this.codeEl = codeEl
        this.langs = langs
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
        this.langs.forEach((selection) => {
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