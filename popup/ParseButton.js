class ParseButton {
    constructor() {
        this.parseButtonEl = document.querySelector('#parseBtn')

        this.init()
    }

    init() {
        this.bindEvent()
    }

    bindEvent() {
        this.parseButtonEl.addEventListener('click', () => {
            // Send msg to parse Medium article
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {eventName: 'parse'},
                    (response) => {
                        console.log(response);
                    });
            });
        });
    }
}
