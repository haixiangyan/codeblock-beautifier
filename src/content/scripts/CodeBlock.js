class CodeBlock {
    constructor(preEl, langsPrefer, computedStyles) {
        this.preEl = preEl
        this.codeEl = this.preEl.querySelector('code') || document.createElement('code')
        this.langsPrefer = langsPrefer
        this.computedStyles = computedStyles
        // Detect possible language
        this.detectedLang = this.detectLang()
        this.selectionPanel = null

        this.init()
    }

    init() {
        this.generateCodeEl()

        this.wrapCodeEl()

        this.autoHighlight()

        this.generatePanelEl()
    }

    autoHighlight() {
        // Remove HTML tags within <code/> element
        this.codeEl.innerText = this.codeEl.innerText

        hljs.highlightBlock(this.codeEl)
    }

    generatePanelEl() {
        // If there is no language detected, then rebuild the whole code block
        if (!this.detectedLang) {
            this.selectionPanel = new SelectionPanel(this.preEl, this.codeEl, this.langsPrefer)
            // Init selection panel to let user redefine language
            this.wrapPanelEl()
        }
    }

    generateCodeEl() {
        this.codeEl.setAttribute('data-highlight', true)
        this.codeEl.style.backgroundColor = this.computedStyles.backgroundColor
        this.codeEl.className = this.detectedLang
        this.codeEl.innerText = this.preEl.innerText
    }

    wrapCodeEl() {
        this.preEl.setAttribute('data-highlight', true)
        this.preEl.innerHTML = ''
        this.preEl.appendChild(this.codeEl)
    }

    wrapPanelEl() {
        this.preEl.appendChild(this.selectionPanel.panel)
    }

    // If this code block defines a language, then use it
    detectLang() {
        let langValue = ''
        let preElAttrs = this.preEl.attributes
        let codeElAttrs = this.codeEl.attributes
        for (let i = 0; i < this.langsPrefer.length; i++) {
            langValue = this.langsPrefer[i].value
            for (let preElAttrIndex = 0; preElAttrIndex < preElAttrs.length; preElAttrIndex++) {
                if (preElAttrs[preElAttrIndex].name.indexOf(langValue) > -1 || preElAttrs[preElAttrIndex].value.indexOf(langValue) > -1) {
                    return langValue
                }
            }
            for (let codeElAttrIndex = 0; codeElAttrIndex < codeElAttrs.length; codeElAttrIndex++) {
                if (codeElAttrs[codeElAttrIndex].name.indexOf(langValue) > -1 || codeElAttrs[codeElAttrIndex].value.indexOf(langValue) > -1) {
                    return langValue
                }
            }
        }

        return ''
    }
}