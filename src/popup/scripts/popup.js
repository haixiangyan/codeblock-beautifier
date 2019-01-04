class PopupManager {
    constructor() {
        this.isParse = false
        // From themes.js
        this.themeSwitch = new ThemesSwitch(themes)
        this.langsSwitch = new LangsSwitch(langs)
        this.parseButton = new ParseButton()
        this.revertButton = new RevertButton()
    }
}

new PopupManager()
