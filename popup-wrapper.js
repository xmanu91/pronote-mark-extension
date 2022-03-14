chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    if (tabs[0] === undefined || !tabs[0].url.includes('index-education.net/pronote/eleve.html')) {
        const errorMessageSpan = document.querySelector('#extErrorMessage')
        errorMessageSpan.textContent = 'You need to be on Pronote (student part) !';
        return
    }

    chrome.tabs.executeScript(tabs[0].id, {
        // showPopup acutally toggles popup here
        code: 'window.__BETTERSTATS_LOADED ? (showPopup(), true) : false'
    }, res => {
        if (!res[0]) {
            chrome.tabs.executeScript(tabs[0].id, {
                file: '/content.js'
            })

            chrome.tabs.insertCSS(tabs[0].id, {
                file: '/content.css'
            })

        }

        window.close();
    });
});
