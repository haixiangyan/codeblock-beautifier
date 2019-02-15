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

    escapeHtml(html) {
        return html
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    autoHighlight() {
        // Remove HTML tags within <code/> element
        this.codeEl.innerHTML = this.escapeHtml(this.codeEl.innerText)

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
        let langValues = []
        let preElAttrs = this.preEl.attributes
        let codeElAttrs = this.codeEl.attributes
        for (let i = 0; i < this.langsPrefer.length; i++) {
            langValues = this.langsPrefer[i].value.split('/')
            for (let preElAttrIndex = 0; preElAttrIndex < preElAttrs.length; preElAttrIndex++) {
                const {name, value} = preElAttrs[preElAttrIndex]
                if (this.detectIfAttrHasLang(langValues, name) || this.detectIfAttrHasLang(langValues, value)) {
                    return this.langsPrefer[i].className
                }
            }
            for (let codeElAttrIndex = 0; codeElAttrIndex < codeElAttrs.length; codeElAttrIndex++) {
                const {name, value} = codeElAttrs[codeElAttrIndex]
                if (this.detectIfAttrHasLang(langValues, name) || this.detectIfAttrHasLang(langValues, value)) {
                    return this.langsPrefer[i].className
                }
            }
        }

        return ''
    }

    detectIfAttrHasLang(langValues, possibleLangStr) {
        // Exclude some predefined patterns
        const excludePatterns = ['hljs', 'testjs']
        const excludeRegExp = new RegExp(`(${excludePatterns.join('|')})`)
        possibleLangStr = possibleLangStr.replace(excludeRegExp, '')

        // Start to detect
        for (let i = 0; i < langValues.length; i++) {
            if (possibleLangStr.indexOf(langValues[i]) > -1) {
                return true
            }
        }

        return false
    }
}