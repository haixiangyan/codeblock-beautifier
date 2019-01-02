class HighlightSwitch {
    constructor() {
        this.onHighlight = document.querySelector('#onHighlight')
        this.offHighlight = document.querySelector('#offHighlight')

        this.init()
    }

    init() {
        this.checkRadio()

        this.bindEvent()
    }

    checkRadio() {
        chrome.storage.sync.get('isHighlight', (data) => {
            if (data.isHighlight) {
                this.onHighlight.setAttribute('checked', true)
                this.offHighlight.removeAttribute('checked')
            }
            else {
                this.offHighlight.setAttribute('checked', true)
                this.onHighlight.removeAttribute('checked')
            }
        })
    }

    bindEvent() {
        this.onHighlight.addEventListener('change', (event) => {
            chrome.storage.sync.set({isHighlight: true})
        })
        this.offHighlight.addEventListener('change', (event) => {
            chrome.storage.sync.set({isHighlight: false})
        })
    }
}

function initOptions() {
    let themeSwitchEl = document.querySelector('#themeSwitch')
    // From themes.js
    themes.forEach((theme) => {
        let optionEl = document.createElement('option')
        optionEl.setAttribute('value', `${theme}.css`)
        optionEl.innerText = theme

        themeSwitchEl.appendChild(optionEl)
    })
}

initOptions()

new HighlightSwitch()