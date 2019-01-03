class ThemesSwitch {
    constructor(themes) {
        this.themes = themes
        this.themesSwitchEl = document.querySelector('#themesSwitch')

        this.init()
    }

    init() {
        this.getDefaultThemeName()

        // Bind switching theme event
        this.bindEvent()
    }

    bindEvent() {
        this.themesSwitchEl.addEventListener('change', (event) => {
            // Send msg to parse switch theme
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {eventName: 'switchThemeName', themeName: event.target.value});
            });
        })
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

            this.themesSwitchEl.appendChild(optionEl)
        })
    }
}
