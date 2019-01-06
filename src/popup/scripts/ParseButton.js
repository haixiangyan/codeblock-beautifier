class ParseButton {
    constructor() {
        this.parseButtonEl = document.querySelector('#parseBtn')

        this.init()
    }

    init() {
        this.setBtnStyles()

        this.listenToBtn()

        this.listenToTheme()
    }

    setBtnStyles() {
        themeManager.getStylesByClassName('hljs-keyword', (computedStyles) => {
            this.parseButtonEl.style.border = `1px solid ${computedStyles.color}`
        })
    }

    listenToBtn() {
        this.parseButtonEl.addEventListener('click', (event) => {
            // Send msg to parse Medium article
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {eventName: 'parse'});
            });
        });
    }

    listenToTheme() {
        eventHub.listen('themeChanged', () => {
            this.setBtnStyles()
        })
    }
}
