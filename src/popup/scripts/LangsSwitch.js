class LangsSwitch {
    constructor(langs) {
        this.langs = langs
        this.langsPrefer = langs
        this.langsSwitch = document.querySelector('#langsSwitch')
        this.computedStyles = {}

        this.solids = []

        this.init()
    }

    init() {
        this.listenToTheme()

        themeManager.getStylesByClassName('hljs-variable', (computedStyles) => {
            // Get computed styles of class 'hljs-variable'
            this.computedStyles = computedStyles

            // Get default language preference
            this.getDefaultLangsPrefer()
        })
    }

    listenToTheme() {
        eventHub.listen('themeChanged', () => {
            themeManager.getStylesByClassName('hljs-variable', (computedStyles) => {
                this.solids.forEach((solid) => {
                    solid.style.backgroundColor = computedStyles.color
                })
            })
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
                    return langPrefer.className !== lang.className
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
        let langsPreferClassName = this.langsPrefer.map((langPrefer) => langPrefer.className)

        this.langs.forEach((lang, index) => {
            let fakeCheckbox = this.generateCheckbox(lang, langsPreferClassName)

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

    generateCheckbox(lang, langsPreferClassName) {
        let fakeCheckbox = document.createElement('span')
        fakeCheckbox.setAttribute('data-className', lang.className)
        fakeCheckbox.setAttribute('data-text', lang.text)
        fakeCheckbox.classList.add('fake-checkbox', 'cover-hljs-variable')
        if (langsPreferClassName.indexOf(lang.className) > -1) {
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

        this.solids.push(solid)

        return solid
    }

    generateLabel(lang) {
        let labelEl = document.createElement('label')
        labelEl.setAttribute('for', lang.className)
        labelEl.setAttribute('class', 'hljs-variable')
        labelEl.innerText = lang.text

        return labelEl
    }

    sortLangsPrefer() {
        this.langsPrefer.sort((langA, langB) => {
            return langB.className.length - langA.className.length
        })
    }
}