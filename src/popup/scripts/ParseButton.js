class ParseButton {
    constructor(themeManager) {
        this.themeManager = themeManager
        this.parseButtonEl = document.querySelector('#parseBtn')

        this.init()
    }

    init() {
        this.initStyles()

        this.bindEvent()
    }

    initStyles() {
        this.themeManager.getStylesByClassName('hljs-meta', (computedStyles) => {
            this.parseButtonEl.style.border = `1px solid ${computedStyles.color}`
        })
    }

    bindEvent() {
        this.parseButtonEl.addEventListener('click', (event) => {
            // Send msg to parse Medium article
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {eventName: 'parse'});
            });
        });
    }
}
