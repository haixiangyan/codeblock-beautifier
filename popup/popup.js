// Change color of button
chrome.storage.sync.get('color', function(data) {
    changeColor.style.backgroundColor = data.color;
    changeColor.setAttribute('value', data.color);
});

// Change document color
// changeColor.onclick = function(element) {
//     let color = element.target.value;
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//         chrome.tabs.executeScript(
//             tabs[0].id,
//             {code: 'console.log("ok")'});
//     });
// };

function initOptions() {
    let themeSwitchEl = document.querySelector('#themeSwitch')
    // From themes.js
    themes.forEach((theme) => {
        let optionEl = document.createElement('option')
        optionEl.setAttribute('value', `${theme}.css`)
        optionEl.innerText = theme

        themeSwitchEl.appendChild(optionEl)
    })
}

initOptions()