const eventHub = new EventHub()
const themeManager = new ThemeManager()

class PopupManager {
    constructor() {
        // From themes.js
        this.themeSwitch = new ThemesSwitch(themes)
        this.langsSwitch = new LangsSwitch(langs)
        this.autoParseSwitch = new AutoParseSwitch()
        this.parseButton = new ParseButton()
        this.revertButton = new RevertButton()
    }
}

new PopupManager()
