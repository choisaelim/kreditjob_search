
 async function setSelectionText(){
    var selectedText = window.getSelection().toString().trim();
    console.log('compName in popup ' + selectedText);
    if (selectedText !== "") {
        await chrome.storage.sync.set({ companyName: selectedText }, () => {
        
        });
    }
 }

 async function getSelectionText(){
    await chrome.storage.sync.get("companyName", async function(items) {
        if (!chrome.runtime.error) {
          console.log(items);
          document.getElementById("info").innerText = items.companyName;
        }
      });
 }

document.body.onload = async function() {
    await setSelectionText();
    await getSelectionText();
    
}

//  chrome.storage.onChanged.addListener(({ companyName }) => {
//     console.log(companyName);
//   });

 //브라우저가 html을 읽고 dom 트리 완성 즉시 발생
//  document.addEventListener('DOMContentLoaded', async function () {
    //팝업 창 열었을 때 
    // await chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //     // Use the Scripting API to execute a script
    //     chrome.scripting.executeScript({
    //       target: { tabId: tabs[0].id },
    //     //   args: [color],
    //       func: getSelectionText
    //     });
    // });
//   });
