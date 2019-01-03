class ThemeManager {
    constructor() {
        this.properties = null
        this.tempDiv = null

        this.init()
    }

    init() {
        this.generateTempDiv()

        this.getProperties((properties) => { })
    }

    generateTempDiv() {
        this.tempDiv = document.createElement('div')
        this.tempDiv.style.display = 'none'
        this.tempDiv.className = 'hljs'

        document.body.appendChild(this.tempDiv)
    }

    getProperties(callback) {
        setTimeout(() => {
            this.properties = getComputedStyle(this.tempDiv)

            callback(this.properties)
        }, 100)
    }
}