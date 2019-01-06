class RevertButton {
    constructor() {
        this.revertButtonEl = document.querySelector('#revertBtn')

        this.init()
    }

    init() {
        this.setBtnStyles()

        this.listenToBtn()

        this.listenToTheme()
    }

    setBtnStyles() {
        themeManager.getStylesByClassName('hljs-keyword', (computedStyles) => {
            this.revertButtonEl.style.border = `1px solid ${computedStyles.color}`
        })
    }

    listenToBtn() {
        this.revertButtonEl.addEventListener('click', (event) => {
            // Send msg to parse Medium article
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {eventName: 'revert'});
            });
        });
    }

    listenToTheme() {
        eventHub.listen('themeChanged', () => {
            this.setBtnStyles()
        })
    }
}