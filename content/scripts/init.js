let codes = Array.from(document.querySelectorAll('pre')).forEach((preEl) => {
    let codeEl = document.createElement('code')
    codeEl.setAttribute('data-highlight', true)
    codeEl.innerText = preEl.innerText

    preEl.setAttribute('data-highlight', true)
    preEl.innerHTML = ''
    preEl.appendChild(codeEl)
})
hljs.initHighlighting()
