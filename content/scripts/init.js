class SelectionPanel {
    constructor() {
        this.view = null

        this.init()
    }

    init() {
        let panelEl= document.createElement('div')

        let langSelectEl = this.generateLangSelector()

        panelEl.appendChild(langSelectEl)

        this.view = panelEl
    }

    generateLangSelector() {
        let langSelectEl = document.createElement('select')
        let selections = [
            {value: 'javascript', text: 'JavaScript'},
            {value: 'java', text: 'Java'},
            {value: 'css', text: 'CSS'},
            {value: 'python', text: 'Python'},
        ]

        selections.forEach((selection) => {
            let optionEl = document.createElement('option')
            optionEl.setAttribute('value', selection.value)
            optionEl.innerText = selection.text

            langSelectEl.appendChild(optionEl)
        })

        return langSelectEl
    }
}

class CodeBlock {
    constructor() {
        this.codes = Array.from(document.querySelectorAll('pre'))

        this.init()
    }

    init() {
        this.codes.forEach((preEl) => {
            let codeEl = this.generateCodeEl(preEl)

            let selectionPanel = new SelectionPanel()

            this.wrapCodeEl(preEl, codeEl)

            preEl.appendChild(selectionPanel.view)
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

highlight()
