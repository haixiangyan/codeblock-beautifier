class AutoParseSwitch {
    constructor(themeManager) {
        this.themeManager = themeManager
        this.autoParseSwitch = document.querySelector('#autoParseSwitch')
        this.trueOption = this.autoParseSwitch.querySelector('option[value="true"]')
        this.falseOption = this.autoParseSwitch.querySelector('option[value="false"]')
        this.isAutoParse = false

        this.init()
    }

    init() {
        this.initStyles()

        this.getDefaultAutoParse()

        this.bindEvent()
    }

    initSwitch() {
        if (this.isAutoParse) {
            this.trueOption.setAttribute('selected', true)
            this.falseOption.removeAttribute('selected')
        }
        else {
            this.falseOption.setAttribute('selected', true)
            this.trueOption.removeAttribute('selected')
        }
    }

    initStyles() {
        this.themeManager.getStylesByClassName('hljs-keyword', (computedStyles) => {
            this.autoParseSwitch.style.border = `1px solid ${computedStyles.color}`
        })
    }

    getDefaultAutoParse() {
        chrome.storage.sync.get(['isAutoParse'], (result) => {
            this.isAutoParse = result.isAutoParse || false
            this.initSwitch()
        });
    }

    setAutoParse() {
        chrome.storage.sync.set({isAutoParse: this.isAutoParse}, () => {
            console.log('Auto parse is set to ' + this.isAutoParse);
        });
    }

    bindEvent() {
        this.autoParseSwitch.addEventListener('change', (event) => {
            this.isAutoParse = !this.isAutoParse
            this.setAutoParse()
        })
    }
}