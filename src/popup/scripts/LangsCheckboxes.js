class LangsCheckboxes {
    constructor(langs) {
        this.langs = langs
        this.langsPrefer = []
        this.langsSwitch = document.querySelector('#langsSwitch')

        this.init()
    }

    init() {
        this.getDefaultLangsPrefer()
    }

    getDefaultLangsPrefer() {
        chrome.storage.sync.get(['langsPrefer'], (result) => {
            this.langsPrefer = result.langsPrefer ? result.langsPrefer : this.langs

            this.generateCheckboxes()
        });
    }

    generateCheckboxes() {
        let langsPreferStr = JSON.stringify(this.langsPrefer)

        this.langs.forEach((lang) => {
            let spanEl = document.createElement('span')

            let checkboxEl = document.createElement('input')
            checkboxEl.setAttribute('id', lang.value)
            checkboxEl.setAttribute('type', 'checkbox')
            checkboxEl.setAttribute('name', 'langsPrefer')
            checkboxEl.setAttribute('value', lang.value)
            if (langsPreferStr.indexOf(JSON.stringify(lang)) > -1) {
                checkboxEl.setAttribute('checked', true)
            }

            let labelEl = document.createElement('label')
            labelEl.setAttribute('for', lang.value)
            labelEl.innerText = lang.text

            spanEl.appendChild(checkboxEl)
            spanEl.appendChild(labelEl)

            this.langsSwitch.appendChild(spanEl)
        })
    }
}