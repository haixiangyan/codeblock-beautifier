class ThemeOptions {
    constructor(themes) {
        this.themes = themes
        this.themeSwitchEl = document.querySelector('#themeSwitch')

        this.init()
    }

    init() {
        this.getDefaultThemeName()
    }

    getDefaultThemeName() {
        chrome.storage.sync.get(['themeName'], (result) => {
            this.generateOptions(result.themeName)
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
