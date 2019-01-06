class RevertButton {
    constructor() {
        this.revertButtonEl = document.querySelector('#revertBtn')

        this.init()
    }

    init() {
        this.listenToBtn()
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
}