class AutoParseCheckBox {
    constructor() {
        this.autoParseCheckBoxEl = document.querySelector('#autoParseCheckBox')
        this.isAutoParse = false

        this.init()
    }

    init() {
        this.getDefaultAutoParse()

        this.bindEvent()
    }

    initCheckBox() {
        if (this.isAutoParse) {
            this.autoParseCheckBoxEl.setAttribute('checked', true)
        }
        else {
            this.autoParseCheckBoxEl.removeAttribute('checked')
        }
    }

    getDefaultAutoParse() {
        chrome.storage.sync.get(['isAutoParse'], (result) => {
            this.isAutoParse = result.isAutoParse || false
            this.initCheckBox()
        });
    }

    setAutoParse() {
        chrome.storage.sync.set({isAutoParse: this.isAutoParse}, () => {
            console.log('Auto parse is set to ' + this.isAutoParse);
        });
    }

    bindEvent() {
        this.autoParseCheckBoxEl.addEventListener('change', (event) => {
            this.isAutoParse = !this.isAutoParse
            this.setAutoParse()
        })
    }
}