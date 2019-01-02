class CodeBlock {
    constructor() {
        this.codes = Array.from(document.querySelectorAll('pre'))
    }
    init() {
        this.codes.forEach((preEl) => {
            let codeEl = this.generateCodeEl(preEl)

            this.wrapCodeEl(preEl, codeEl)
        })
    }

    generateCodeEl(preEl) {
        let codeEl = document.createElement('code')
        codeEl.setAttribute('data-highlight', true)
        codeEl.innerText = preEl.innerText

        return codeEl
    }

    wrapCodeEl(preEl, codeEl) {
        preEl.setAttribute('data-highlight', true)
        preEl.innerHTML = ''
        preEl.appendChild(codeEl)
    }
}

function highlight() {
    hljs.initHighlighting()
}

let codeBlock = new CodeBlock()
codeBlock.init()

highlight()
