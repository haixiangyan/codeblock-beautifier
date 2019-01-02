class ThemeOptions {
    constructor(themes) {
        this.themes = themes
        this.themeSwitchEl = document.querySelector('#themeSwitch')

        this.init()
    }

    init() {
        chrome.storage.sync.get(['theme'], (result) => {
            this.generateOptions(result.theme)
        });
    }

    // Generate theme options for <select/>
    generateOptions(defaultTheme) {
        this.themes.forEach((theme) => {
            let optionEl = document.createElement('option')
            optionEl.setAttribute('value', theme)
            optionEl.innerText = theme
            if (theme === defaultTheme) {
                optionEl.setAttribute('selected', true)
            }

            this.themeSwitchEl.appendChild(optionEl)
        })
    }
}
