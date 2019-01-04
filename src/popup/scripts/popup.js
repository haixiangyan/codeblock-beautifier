class PopupManager {
    constructor() {
        // From themes.js
        this.themeSwitch = new ThemesSwitch(themes)
        this.langsSwitch = new LangsSwitch(langs)
        this.parseButton = new ParseButton()
        this.revertButton = new RevertButton()
        this.autoParseCheckBox = new AutoParseCheckBox()
    }
}

new PopupManager()
