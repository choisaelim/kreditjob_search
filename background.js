let companyList = [
    // {id: '1', company: "금병영 / 서울, 강동구", link : ""},
    // {id: '2', company: "테스트 / 서울, 강북구", link : ""}
];

chrome.webNavigation.onCompleted.addListener(() => {
    console.log("completed");
});

chrome.webNavigation.onCommitted.addListener(() => {
    console.log("committed");
});

chrome.webNavigation.onReferenceFragmentUpdated.addListener(() => {
    console.log("reference updated");
});
chrome.webNavigation.onBeforeNavigate.addListener(() => {
    console.log("onBeforeNavigate");
});

chrome.webNavigation.onCreatedNavigationTarget.addListener(() => {
    console.log("onCreatedNavigationTarget");
});

chrome.webNavigation.onDOMContentLoaded.addListener(() => {
    console.log("onDOMContentLoaded");
});

chrome.webNavigation.onErrorOccurred.addListener(() => {
    console.log("onErrorOccurred");
});

chrome.webNavigation.onReferenceFragmentUpdated.addListener(() => {
    console.log("onReferenceFragmentUpdated");
});

chrome.webNavigation.onTabReplaced.addListener(() => {
    console.log("onTabReplaced");
});

chrome.webNavigation.onHistoryStateUpdated.addListener((browserActivityState) => {
    console.log(browserActivityState);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] != undefined && tabs[0].url.match("https://.*.wanted.co.kr/.*")) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: "run",
                browserActivityState: browserActivityState,
            });
        }
    });
    // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //     if (tabs[0] != undefined) {
    //         console.log(tabs[0]);
    //         chrome.tabs.sendMessage(tabs[0].id, { action: "run" });
    //     }
    // });
});

//로딩시 기본 이벤트
chrome.runtime.onInstalled.addListener(async () => {
    //마우스 오른쪽 클릭시 기본 메뉴
    chrome.contextMenus.create({
        id: "select_company",
        title: "회사 검색하기",
        type: "normal",
        contexts: ["selection"],
    });
});

const setStorageData = (data) =>
    new Promise((resolve, reject) =>
        chrome.storage.sync.set(data, () =>
            chrome.runtime.lastError ? reject(Error(chrome.runtime.lastError.message)) : resolve()
        )
    );
const getStorageData = (key) =>
    new Promise((resolve, reject) =>
        chrome.storage.sync.get(key, (result) =>
            chrome.runtime.lastError
                ? reject(Error(chrome.runtime.lastError.message))
                : resolve(result)
        )
    );
//마우스 오른쪽 메뉴 클릭시 이벤트
chrome.contextMenus.onClicked.addListener(async (item, tab) => {
    // let map = new Map();
    // console.log(map.get(item.selectionText));

    // console.log(map.get(item.selectionText));
    let selectedText = item.selectionText;
    selectedText.trim();
    selectedText.replace("(주)", "");
    //괄호로 감싼 부분 제거 ex. 씨엘엠앤에스(CLM&S)
    await setStorageData({ selectedText: selectedText });
    // let { selectedText } = await getStorageData("selectedText");

    // let t = await getStorageData("t");

    // // if (t.length == undefined) {
    // let map = new Map();
    // map.set(item.selectionText, {
    //     salary: "3000만원",
    //     totalWorker: "100명",
    //     exWorker: "10명",
    //     inWorker: "10명",
    //     year: "3년",
    // });
    // await setStorageData({ t: map });
    // let tt = await getStorageData("t");
    // debugger;
    // } else {
    //     t.set(item.selectionText, {
    //         salary: "3000만원",
    //         totalWorker: "100명",
    //         exWorker: "10명",
    //         inWorker: "10명",
    //         year: "3년",
    //     });
    //     await setStorageData({ t: t });
    // }

    // await chrome.storage.sync.get(["compInfo"], async function (items) {
    //     if (items != undefined && items != null) {
    //         console.log(items.companyName);
    //     }

    //     if (items.companyName == null) {
    //         //드래그한 회사이름 storage에 companyName으로 저장
    //         await chrome.storage.sync.set(
    //             {
    //                 companyName: {
    //                     name: item.selectionText,
    //                     info: {
    //                         salary: "3000만원",
    //                         totalWorker: "100명",
    //                         exWorker: "10명",
    //                         inWorker: "10명",
    //                         year: "3년",
    //                     },
    //                 },
    //             },
    //             () => {
    //                 console.log("compName in context " + item.selectionText);
    //             }
    //         );
    //     } else {
    //         console.log("data exist");
    //     }
    // });
});

/* 현재 미사용 코드
//크롬 익스텐션 아이콘 클릭시, 팝업이 없을 때 기본 로딩되는 이벤트
chrome.action.onClicked.addListener(async (tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getSelection
  });
  console.log('test');
});

function getSelection() {
  var selectedText = window.getSelection().toString().trim();

  if (selectedText !== "") {
    console.log('test ' + selectedText);
  }
}
*/
