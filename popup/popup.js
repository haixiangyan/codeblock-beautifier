class ThemeOptions {
    constructor(themes) {
        this.themes = themes
        this.themeSwitchEl = document.querySelector('#themeSwitch')

        this.init()
    }

    init() {
        this.themes.forEach((theme) => {
            let optionEl = document.createElement('option')
            optionEl.setAttribute('value', theme)
            optionEl.innerText = theme

            this.themeSwitchEl.appendChild(optionEl)
        })
    }
}

class ParseButton {
    constructor() {
        this.parseButtonEl = document.querySelector('#parseBtn')

        this.init()
    }

    init() {
        this.bindEvent()
    }

    bindEvent() {
        this.parseButtonEl.addEventListener('click', () => {
            // Send msg to parse Medium article
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {eventName: 'parse'},
                    (response) => {
                        console.log(response);
                    });
            });
        });
    }
}

class ThemeSwitch {
    constructor() {
        this.themeSwitchEl = document.querySelector('#themeSwitch')

        this.init()
    }

    init() {
        this.bindEvent()
    }

    bindEvent() {
        this.themeSwitchEl.addEventListener('change', (event) => {
            // Send msg to parse Medium article
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {eventName: 'switchTheme', themeName: event.target.value},
                    (response) => {
                        console.log(response);
                    });
            });
        })
    }
}

// From themes.js
new ThemeOptions(themes)
new ParseButton()
new ThemeSwitch()
