class PopupManager {
    constructor() {
        this.themeManager = new ThemeManager()
        // From themes.js
        this.themeSwitch = new ThemesSwitch(themes, this.themeManager)
        this.langsSwitch = new LangsSwitch(langs, this.themeManager)
        this.parseButton = new ParseButton()
        this.revertButton = new RevertButton()
        this.autoParseCheckBox = new AutoParseCheckBox()
    }
}

new PopupManager()
