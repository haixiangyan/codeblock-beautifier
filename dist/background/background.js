chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            // If web page has <pre/> element, then it enables popup action
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                css: ['pre']
            })],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});