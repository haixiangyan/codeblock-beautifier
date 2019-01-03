class RevertButton {
    constructor() {
        this.revertButtonEl = document.querySelector('#revertBtn')

        this.init()
    }

    init() {
        this.bindEvent()
    }

    bindEvent() {
        this.revertButtonEl.addEventListener('click', () => {
            // Send msg to parse Medium article
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {eventName: 'revert'});
            });
        });
    }
}