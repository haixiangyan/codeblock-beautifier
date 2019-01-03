class LangsSwitch {
    constructor(langs) {
        this.langs = langs
        this.langsPrefer = langs
        this.langsSwitch = document.querySelector('#langsSwitch')

        this.init()
    }

    init() {
        this.getDefaultLangsPrefer()

        // Bind switching language preference event
        this.bindEvent()
    }

    bindEvent() {
        // Use event hosting to listen to check event
        this.langsSwitch.addEventListener('click', (event) => {
            let checkingEl = event.target
            if (checkingEl.getAttribute('type') !== 'checkbox') {
                return
            }

            if (checkingEl.checked) {
                // Add this language
                this.langsPrefer.push({
                    value: checkingEl.value,
                    text: checkingEl.innerText
                })
            }
            else {
                // Remove this language
                this.langsPrefer = this.langsPrefer.filter((langPrefer) => {
                    return langPrefer.value !== checkingEl.value
                })
            }
            this.setLangsPrefer()
        })
    }

    getDefaultLangsPrefer() {
        chrome.storage.sync.get(['langsPrefer'], (result) => {
            this.langsPrefer = result.langsPrefer ? result.langsPrefer : this.langsPrefer

            this.generateCheckboxes()
        });
    }

    setLangsPrefer() {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(
                tabs[0].id,
                {eventName: 'switchLangsPrefer', langsPrefer: this.langsPrefer});
        });
    }

    generateCheckboxes() {
        let langsPreferValue = this.langsPrefer.map((langPrefer) => langPrefer.value)

        this.langs.forEach((lang) => {
            let spanEl = document.createElement('span')

            let checkboxEl = document.createElement('input')
            checkboxEl.setAttribute('id', lang.value)
            checkboxEl.setAttribute('type', 'checkbox')
            checkboxEl.setAttribute('name', 'langsPrefer')
            checkboxEl.setAttribute('value', lang.value)
            if (langsPreferValue.indexOf(lang.value) > -1) {
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