class ThemesSwitch {
    constructor(themes, themeManager) {
        this.themes = themes
        this.themeManager = themeManager
        this.themesSwitchEl = document.querySelector('#themesSwitch')

        this.themeLinkeEl = document.querySelector('#themeLink')

        this.init()
    }

    init() {
        // Init <select/> styles
        this.initStyles()

        // Get default theme name
        this.getDefaultThemeName()

        // Bind switching theme event
        this.bindEvent()
    }

    setPopupTheme(themeName) {
        this.themeLinkeEl.href = `../lib/highlight/styles/${themeName}.css`
    }

    initStyles() {
        this.themeManager.getStylesByClassName('hljs-string', (computedStyles) => {
            this.themesSwitchEl.style.border = `1px solid ${computedStyles.color}`
        })
    }

    bindEvent() {
        this.themesSwitchEl.addEventListener('change', (event) => {
            let themeName = event.target.value
            // Send msg to parse switch theme
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {eventName: 'switchThemeName', themeName: themeName});
            });

            // Change popup theme
            this.setPopupTheme(themeName)
        })
    }

    getDefaultThemeName() {
        chrome.storage.sync.get(['themeName'], (result) => {
            this.generateOptions(result.themeName)

            this.setPopupTheme(result.themeName)
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

            this.themesSwitchEl.appendChild(optionEl)
        })
    }
}
