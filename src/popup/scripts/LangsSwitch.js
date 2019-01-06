class LangsSwitch {
    constructor(langs) {
        this.langs = langs
        this.langsPrefer = langs
        this.langsSwitch = document.querySelector('#langsSwitch')
        this.computedStyles = {}

        this.init()
    }

    init() {
        themeManager.getStylesByClassName('hljs-variable', (computedStyles) => {
            // Get computed styles of class 'hljs-variable'
            this.computedStyles = computedStyles

            // Get default language preference
            this.getDefaultLangsPrefer()
        })
    }

    listenToCheckbox(spanEl, lang) {
        // Use event hosting to listen to check event
        spanEl.addEventListener('click', (event) => {
            let fakeCheckbox = event.currentTarget.querySelector('.fake-checkbox')
            console.log(fakeCheckbox);

            // If it is checked
            if (fakeCheckbox.className.indexOf('is-check') > -1) {
                // Remove this language
                this.langsPrefer = this.langsPrefer.filter((langPrefer) => {
                    return langPrefer.value !== lang.value
                })
            }
            else {
                // Add this language
                this.langsPrefer.push(lang)
            }
            // Toggle class
            fakeCheckbox.classList.toggle('is-check')

            this.sortLangsPrefer()
            this.setLangsPrefer()
            // Wait for setting new language preference
            setTimeout(() => {
                this.applyLangsPrefer()
            }, 100)
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

    // Apply language preference to this page
    applyLangsPrefer() {
        document.querySelector('#revertBtn').click()
        document.querySelector('#parseBtn').click()
    }

    generateCheckboxes() {
        let langsPreferValue = this.langsPrefer.map((langPrefer) => langPrefer.value)

        this.langs.forEach((lang, index) => {
            let fakeCheckbox = this.generateCheckbox(lang, langsPreferValue)

            let labelEl = this.generateLabel(lang)

            let spanEl = this.generateLangWrapper(lang, index , fakeCheckbox, labelEl)

            this.langsSwitch.appendChild(spanEl)
        })
    }

    generateLangWrapper(lang, index, fakeCheckbox, labelEl) {
        let spanEl = document.createElement('span')
        spanEl.className = 'lang-wrapper'
        spanEl.appendChild(fakeCheckbox)
        spanEl.appendChild(labelEl)
        if (index + 1 < this.langs.length) {
            spanEl.appendChild(new Text(", "))
        }

        this.listenToCheckbox(spanEl, lang)

        return spanEl
    }

    generateCheckbox(lang, langsPreferValue) {
        let fakeCheckbox = document.createElement('span')
        fakeCheckbox.setAttribute('data-value', lang.value)
        fakeCheckbox.setAttribute('data-text', lang.text)
        fakeCheckbox.classList.add('fake-checkbox')
        fakeCheckbox.style.border = `1px solid ${this.computedStyles.color}`
        if (langsPreferValue.indexOf(lang.value) > -1) {
            fakeCheckbox.classList.add('is-check')
            fakeCheckbox.setAttribute('data-check', true)
        }

        let solid = this.generateCheckboxSolid()
        fakeCheckbox.appendChild(solid)

        return fakeCheckbox
    }

    generateCheckboxSolid() {
        let solid = document.createElement('span')
        solid.style.backgroundColor = this.computedStyles.color

        return solid
    }

    generateLabel(lang) {
        let labelEl = document.createElement('label')
        labelEl.setAttribute('for', lang.value)
        labelEl.setAttribute('class', 'hljs-variable')
        labelEl.innerText = lang.text

        return labelEl
    }

    sortLangsPrefer() {
        this.langsPrefer.sort((langA, langB) => {
            return langB.value.length - langA.value.length
        })
    }
}