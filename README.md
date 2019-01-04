# Code Block Beautifier 
![Logo](screenshot/icon-origin.png)

A chrome extension for beautifying code blocks in any websites that contain `<pre/>` elements. It is developed based on [highlight.js](https://highlightjs.org/) and [Chrome Extension API](https://developer.chrome.com/home).

## Screenshot

[![Extension Preview](https://img.youtube.com/vi/3MbCE7eEYr8/0.jpg)](https://www.youtube.com/watch?v=3MbCE7eEYr8)

## Download

Check [this]() on Chrome app store.

or

[Download from ./dist/codeblock-beautifier.crx](./dist/codeblock-beautifier.crx) it anyway.

## How to use

### Switch theme
Left click the extension, then it will popup a panel. Select any themes you love, and it will switch to that theme immediately.

![Switch Theme](screenshot/themePanel.PNG)

### Switch languages
Because Medium.com doesn't allow us to specify what languages for code blocks, highlight.js may detect a wrong language.
You may need to select the correct language manually.

On the bottom left of each code block, there's a selector for you to pick the correct language.

![Languages Selector](screenshot/langSelector.PNG)


## Features

* ⚒ Beautify any code blocks wrapping in `<pre/>` automatically. 

* 🎉 More than 80 themes are available. Can switch to any language highlight solutions.

* 🎊 More than 20 language highlight themes are available. Can switch to any highlight themes you like.

* 🧲 Parser will beautify code blocks according to your languages preference.

* 🔓 Auto detect what languages that the website defines

* 🎁 Supporting [Medium](https://medium.com/), [StackOverflow](https://stackoverflow.com/), [MDN](https://developer.mozilla.org/en-US/),
[简书](https://www.jianshu.com/), [知乎](https://www.zhihu.com/), [W3C Plus](https://www.w3cplus.com/).

## Purpose
The main reason I develop it it because [Medium](www.medium.com) doesn't provide a good highlight code blocks.
Well, I know there are several ways to embed codes in it, but some people (like me) don't wanna create a gist or code sandbox project to put codes on my block. So most of time, I see this 🙄:

![No highlight](screenshot/medium.PNG)

What I expect should be like this 😄:

![Highlight](screenshot/jianshu.PNG)

So I build an extension to beautify code blocks in [Medium](www.medium.com).

It does beautify all code blocks. It can also be used for other websites that contain `<pre/>`.
The only thing you need to do is to press the "Parse" button!

## Future
There may have some problems that I haven't found for this extension yet. If you have any questions or find any bugs, please put an issue on this repo. Thank you!

## Change Log

### v1.0

* Add parsing action. It is able to parse code blocks and apply given theme.

* Add styles to beautify each code blocks.

### v1.1

* Enable user to select highlight languages with adding a panel below code blocks. 

* Enable user to select different theme and apply to all code blocks.

### v1.2

* Enable user to select highlight languages preference. Because highlight.js may detect wrong languages,
setting highlight languages preference can let it detect correctly.

* Add revert action. User can revert parsed code blocks to original styles.

### v1.3

* Add background color of theme to inline style of `<code/>` to adapt most websites.

* Add auto detection for those websites that have already defined what languages should be highlighted.

* Add auto parsing action.

* Fix bugs:

    * Remove loading CSS files at the beginning
    
    * Compatible with some websites that have CSS styles on `<pre/>` or `<code/>`
    
    * Reverting to original HTML elements.
    
    * Can switch language preference immediately.
