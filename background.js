import { regexName } from "./util.js";

// chrome.webRequest.onCompleted.addListener(() => {
//     console.log("completed");
// });

// function tellContentScriptToReload() {
//     console.log("hello world");
// }

// function complete() {
//     console.log("com");
// }

// chrome.webRequest.onCompleted.addListener(complete, {
//     urls: ["https://www.wanted.co.kr/*"],
// });

// chrome.webRequest.onResponseStarted.addListener(
//     function (details) {
//         console.log("test");
//     },
//     { urls: ["<all_urls>"] }
// );

const networkFilters = {
    urls: ["https://www.wanted.co.kr/*", "https://www.saramin.co.kr/*"],
};
//https://www.wanted.co.kr/api/chaos/recruit/v1/positions/recommended?1687918106834
const wantedUrl = [
    "https://.*.wanted.co.kr/api/v4/jobs.*",
    // "https://.*.wanted.co.kr/matched.*",
    "https://.*.wanted.co.kr/api/chaos/recruit.*",
];
const matchedUrl = (url, urlArry) => {
    let result = false;
    urlArry.forEach((el) => {
        if (url.match(el)) {
            result = true;
        }
    });
    return result;
};
chrome.webRequest.onCompleted.addListener((details) => {
    // console.log(details.url + matchedUrl(details.url, wantedUrl));
    if (matchedUrl(details.url, wantedUrl) && details.tabId != undefined) {
        console.log(details.url);
        chrome.tabs.sendMessage(details.tabId, {
            action: "wanted",
        });
    } else if (
        details.url.match("https://.*.saramin.co.kr/zf_user/jobs/relay/view-ajax.*") &&
        details.tabId != undefined
    ) {
        console.log(details.url);
        // debugger;
        chrome.tabs.sendMessage(details.tabId, {
            action: "saramin",
        });
    }
}, networkFilters);

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    if (
        details.transitionQualifiers.length > 0 &&
        details.transitionQualifiers[0] == "forward_back"
    ) {
        if (details.url.match("https://.*.wanted.co.kr/wdlist/.*") && details.tabId != undefined) {
            chrome.tabs.sendMessage(details.tabId, {
                action: "wanted",
            });
        } else if (
            details.url.match("https://.*.saramin.co.kr/zf_user/jobs/list/.*") &&
            details.tabId != undefined
        ) {
            chrome.tabs.sendMessage(details.tabId, {
                action: "saramin",
            });
        }
    }

    if (
        details.url.match("https://.*.saramin.co.kr/zf_user/jobs/list/.*") &&
        details.tabId != undefined
    ) {
        console.log(datails.url);
        chrome.tabs.sendMessage(details.tabId, {
            action: "saramin",
        });
    }
});
// chrome.webNavigation.onTabReplaced.addListener((browserActivityState) => {
//     console.log(browserActivityState);
// });

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

// const regexName = (e) => {
//     e.trim();
//     e.replace("(주)", "");
//     e.replace(/(.*)/gi, "");
//     return e;
// };

//마우스 오른쪽 메뉴 클릭시 이벤트
chrome.contextMenus.onClicked.addListener(async (item, tab) => {
    let selectedText = regexName(item.selectionText);
    console.log(selectedText);
    //괄호로 감싼 부분 제거 ex. 씨엘엠앤에스(CLM&S)
    await setStorageData({ selectedText: selectedText });
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
