class ThemeManager {
    constructor() {
        this.properties = null
        this.tempWrapper = document.createElement('div')
        this.hljsStylesInfo = [
            { className: 'hljs', el: 'div', properties: ['background-color']},
            { className: 'hljs-string', el: 'div', properties: ['color', 'border-color']},
            { className: 'hljs-keyword', el: 'div', properties: ['border-color']},
            { className: 'hljs-variable', el: 'div', properties: ['color', 'border-color']},
            { className: 'hljs-comment', el: 'div', properties: ['color']},
        ]

        this.newStyleEl = null

        this.initTempElement()
        this.initStyleElement()
    }

    initStyleElement() {
        this.newStyleEl = document.createElement('style')
        document.head.appendChild(this.newStyleEl)
    }

    initTempElement() {
        this.hljsStylesInfo.forEach((info) => {
            this.tempWrapper.appendChild(this.buildTempElement(info.el, info.className))
        })
        document.body.appendChild(this.tempWrapper)
    }

    buildTempElement(tagName, className) {
        let tempElement = document.createElement(tagName)
        tempElement.style.display = 'none'
        tempElement.id = className
        tempElement.className = className

        return tempElement
    }

    getStylesByClassName(className, callback) {
        setTimeout(() => {
            let computedStyles = getComputedStyle(this.tempWrapper.querySelector(`*[class="${className}"]`))
            callback(computedStyles)
        }, 50)
    }

    getHljsStyles() {
        setTimeout(() => {
            let newHljsStyleCodes = ''
            this.hljsStylesInfo.forEach((info) => {
                let computedStyles = getComputedStyle(this.tempWrapper.querySelector(`*[class="${info.className}"]`))
                let hljsStyle = `.cover-${info.className} {`
                info.properties.forEach((property) => {
                    hljsStyle += `${property}: ${computedStyles[property]};`
                })
                newHljsStyleCodes += hljsStyle + '}\n'
            })
            this.newStyleEl.innerText = newHljsStyleCodes
        }, 100)
    }
}