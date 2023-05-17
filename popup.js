
 function getSelectionText(){
    var selectedText = window.getSelection().toString().trim();

    if (selectedText !== "") {
        chrome.storage.sync.set({ companyName: selectedText }, () => {
        console.log('compName in popup ' + selectedText);
        });
    }
 }

 //브라우저가 html을 읽고 dom 트리 완성 즉시 발생
 document.addEventListener('DOMContentLoaded', function () {
    //팝업 창 열었을 때 
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        // Use the Scripting API to execute a script
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
        //   args: [color],
          func: getSelectionText
        });
    });
    
    chrome.storage.sync.get('companyName', ({ compName }) => {
        console.log(document.getElementById('info'));
        document.getElementById('info').innerHTML = '회사명 : ' + compName;
      });

  });

// createForm().catch(console.error);
async function search(){
    const companyName = await chrome.storage.sync.get('companyName');
    const infoView = document.getElementById('info');
    if(companyName != null && companyName != ''){
        infoView.appendChild(companyName);
    }
}
// async function createForm() {
//   const { enabledTlds = Object.keys(tldLocales) } =
//     await chrome.storage.sync.get('enabledTlds');
//   const checked = new Set(enabledTlds);

//   const form = document.getElementById('form');
//   for (const [tld, locale] of Object.entries(tldLocales)) {
//     const checkbox = document.createElement('input');
//     checkbox.type = 'checkbox';
//     checkbox.checked = checked.has(tld);
//     checkbox.name = tld;
//     checkbox.addEventListener('click', (event) => {
//       handleCheckboxClick(event).catch(console.error);
//     });

//     const span = document.createElement('span');
//     span.textContent = locale;

//     const div = document.createElement('div');
//     div.appendChild(checkbox);
//     div.appendChild(span);

//     form.appendChild(div);
//   }
// }

// async function handleCheckboxClick(event) {
//   const checkbox = event.target;
//   const tld = checkbox.name;
//   const enabled = checkbox.checked;

//   const { enabledTlds = Object.keys(tldLocales) } =
//     await chrome.storage.sync.get('enabledTlds');
//   const tldSet = new Set(enabledTlds);

//   if (enabled) tldSet.add(tld);
//   else tldSet.delete(tld);

//   await chrome.storage.sync.set({ enabledTlds: [...tldSet] });
// }
