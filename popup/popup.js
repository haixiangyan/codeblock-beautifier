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
