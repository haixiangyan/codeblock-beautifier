class CodeBlock {
    constructor(preEl, langs) {
        this.preEl = preEl
        this.langs = langs
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

        // Init selection panel to let user redefine language
        this.selectionPanel = new SelectionPanel(this.preEl, this.codeEl, this.langs)
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