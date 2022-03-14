let overlay = null,
    frame = null;

window.__BETTERSTATS_LOADED = true;


window.addEventListener('message', e => {
    if (e.data && e.data.type === 'find_card') {
        calculateMark();
    }

    if (e.data && e.data.type === 'resize') {
        frame.style.height = '240px';
    }
});


// Event send by the extension popup
chrome.runtime.onMessage.addListener((request) => {
    if (request.type == 'popup') {
        showPopup();

    } else if (request.type === 'close_popup') {
        hidePopup();
    }
    return true;
});

function showPopup() {

    if (document.querySelector('.bs-popup-overlay')) {
        hidePopup();
        return false;
    }

    overlay = document.createElement('div');
    frame = document.createElement('object');

    overlay.className = 'bs-popup-overlay';
    frame.className = 'bs-popup-container';
    frame.setAttribute('scrolling', 'no');
    frame.setAttribute('frameborder', '0');

    // file need to be added in manifest web_accessible_resources
    frame.data = chrome.runtime.getURL('popup.html');
    overlay.appendChild(frame);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', hidePopup);
}

function hidePopup() {
    // Remove EventListener
    overlay.removeEventListener('click', hidePopup);

    // Remove the elements:
    document.querySelector('.bs-popup-overlay').remove();

    // Clean up references:
    overlay = null;
    frame = null;
}

function calculateMark() {

    if(document.querySelector('.fil-ariane').innerText === 'Notes' || document.querySelector('.fil-ariane').innerText === 'Compétences'){
        let notes = [];

        if(document.querySelector('.fil-ariane').innerText === 'Compétences'){
            document.querySelectorAll('.PetitEspaceGauche .NiveauAcquisition_Pastille').forEach(el => {
                switch(el.getAttribute('title')){
                    case 'Très bonne maîtrise':
                        notes.push(20);
                        break;
                    case 'Maîtrise satisfaisante':
                        notes.push(15);
                        break;
                    case 'Maîtrise fragile':
                        notes.push(10);
                        break;
                    case 'Maîtrise insuffisante':
                        notes.push(5);
                        break;
                }
            });

            let total = 0;

            notes.forEach(e => {
                if(!isNaN(e)){
                    total += e;
                }
            });

            frame.contentWindow.postMessage({ type: 'mark', mark:  total / notes.length}, '*');

        }else{
            document.querySelectorAll('.AlignementDroit').forEach(el => {
                const text = el.innerText;
                let number = 0;

                if(text.includes('/')){
                    const splitedText = text.split('/');
                    number =  Number.parseFloat(splitedText[0].replace(',', '.')) / Number.parseFloat(splitedText[1]);
                }else{
                    number = Number.parseFloat(text.replace(',', '.')) / 20;
                }

                notes.push(number);
            });

            let total = 0;

            notes.forEach(e => {
                if(!isNaN(e)){
                    total += e;
                }
            });

            frame.contentWindow.postMessage({ type: 'mark', mark:  (total / (notes.length - 1)) * 20}, '*');
        }


    }else{
        frame.contentWindow.postMessage({ type: 'noNotes'}, '*');
    }
}

showPopup();
