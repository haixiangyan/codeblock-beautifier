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
            // Send msg to parse switch theme
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
