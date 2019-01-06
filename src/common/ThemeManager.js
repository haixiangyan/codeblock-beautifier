class ThemeManager {
    constructor() {
        this.properties = null
        this.tempWrapper = document.createElement('div')

        this.tempWrapper.appendChild(this.buildTempElement('div', 'hljs'))
        this.tempWrapper.appendChild(this.buildTempElement('span', 'hljs-keyword'))
        this.tempWrapper.appendChild(this.buildTempElement('span', 'hljs-string'))
        this.tempWrapper.appendChild(this.buildTempElement('span', 'hljs-comment'))
        this.tempWrapper.appendChild(this.buildTempElement('span', 'hljs-variable'))
        this.tempWrapper.appendChild(this.buildTempElement('span', 'hljs-meta'))
        this.tempWrapper.appendChild(this.buildTempElement('span', 'hljs-function'))

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
        }, 100)
    }
}