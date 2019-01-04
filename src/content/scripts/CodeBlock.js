class CodeBlock {
    constructor(preEl, langsPrefer, properties) {
        this.preEl = preEl
        this.langsPrefer = langsPrefer
        this.properties = properties
        this.codeEl = this.generateCodeEl(preEl)
        this.selectionPanel = null
        this.detectedLang = ''

        this.init()
    }

    init() {
        // Detect possible language
        this.detectedLang = this.detectLang()

        // If there is no language detected, then rebuild the whole code block
        if (!this.detectedLang) {
            this.rebuildPreEl()
        }
    }

    rebuildPreEl() {
        this.wrapCodeEl()

        hljs.highlightBlock(this.codeEl)

        // Init selection panel to let user redefine language
        this.selectionPanel = new SelectionPanel(this.preEl, this.codeEl, this.langsPrefer)
        this.wrapPanelEl()
    }

    generateCodeEl(preEl) {
        let codeEl = document.createElement('code')
        codeEl.setAttribute('data-highlight', true)
        codeEl.style.backgroundColor = this.properties.backgroundColor
        codeEl.className = this.detectedLang
        codeEl.innerText = preEl.innerText

        return codeEl
    }

    wrapCodeEl() {
        this.preEl.setAttribute('data-highlight', true)
        this.preEl.innerHTML = ''
        this.preEl.appendChild(this.codeEl)
    }

    // If this code block defines a language, then use it
    detectLang() {
        let langValue = ''
        let preElAttributes = this.preEl.attributes
        let codeElAttributes = this.codeEl.attributes
        for (let i = 0; i < this.langsPrefer.length; i++) {
            langValue = this.langsPrefer[i].value
            for (let attr of Object.values(preElAttributes)) {
                if (attr.name.indexOf(langValue) > -1 || attr.value.indexOf(langValue) > -1) {
                    return langValue
                }
            }
            for (let attr of Object.values(codeElAttributes)) {
                if (attr.name.indexOf(langValue) > -1 || attr.value.indexOf(langValue) > -1) {
                    return langValue
                }
            }
        }

        return ''
    }

    wrapPanelEl() {
        this.preEl.appendChild(this.selectionPanel.panel)
    }
}