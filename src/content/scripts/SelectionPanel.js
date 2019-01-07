class SelectionPanel {
    constructor(preEl, codeEl, langsPrefer) {
        this.preEl = preEl
        this.codeEl = codeEl
        this.langsPrefer = langsPrefer
        this.lang = this.codeEl.classList[1]
        this.panel = this.generatePanelEl()
        this.langSelector = this.generateLangSelector()

        this.init()
    }

    init() {
        this.panel.appendChild(this.langSelector)

        this.listenToLangSwitch()
    }

    generatePanelEl() {
        return document.createElement('div')
    }

    generateLangSelector() {
        let langSelectEl = document.createElement('select')

        // From langs.js, building options for <select/>
        this.langsPrefer.forEach((langPrefer) => {
            let optionEl = document.createElement('option')
            optionEl.setAttribute('value', langPrefer.className)
            optionEl.selected = (this.lang === langPrefer.className)
            optionEl.innerText = langPrefer.text

            langSelectEl.appendChild(optionEl)
        })

        return langSelectEl
    }

    listenToLangSwitch() {
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