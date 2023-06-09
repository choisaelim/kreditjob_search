async function getCompanys(name, index) {
    const companysUrl = "http://localhost:3000/api/search?name=" + name + "&index=" + index;
    const res = await fetch(companysUrl);
    const data = await res.json();

    // if (data.status === "success") {
    //     console.log(data.companyList);
    //     return data.companyList;
    // } else {
    //     return "검색 결과가 없습니다";
    // }
    return data;
}

document.body.onload = async function () {
    // await updateCompanyInfo();
};

document.getElementById("onclicked-button").addEventListener("click", async () => {
    await updateCompanyInfo();
});

//companyName
//companyList - 배열

async function getCompanyInfo() {
    let c = new Promise(function (resolve, reject) {
        chrome.storage.sync.get("comp", function (item) {
            resolve(item.comp);
        });
    });
    let result = await c;
    return result;
}
async function setCompanyInfo(value) {
    let c = new Promise(function (resolve, reject) {
        chrome.storage.sync.set({ comp: value }).then(() => {
            console.log("storage sync set comp " + value);
            resolve();
        });
    });
    let result = await c;
    return result;
}
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
chrome.storage.onChanged.addListener(async ({ selectedText, test }) => {
    debugger;
    const popup = await chrome.action.getPopup({});
});
// const { data } = await getStorageData("data");

// await setStorageData({ data: [someData] });

async function updateCompanyInfo() {
    let { selectedText } = await getStorageData("selectedText");
    let exist = await getStorageData(selectedText);
    debugger;

    const info = document.getElementById("info");
    //이미 생성된 회사 정보가 있으면 지우고 새로 생성
    if (document.getElementById("popupContent") != null) {
        info.removeChild(document.getElementById("popupContent"));
    }
    const content = document.createElement("div");
    content.id = "popupContent";
    info.appendChild(content);
    const compNameDiv = document.createElement("div");
    compNameDiv.innerText = selectedText;
    //사용자가 마우스로 선택한 회사 이름 표시
    content.appendChild(compNameDiv);

    let resultMsgDiv = document.createElement("div");

    if (exist != undefined) {
        let res = exist;
        //storage 저장

        let firstLineDiv = document.createElement("div");
        let secondLineDiv = document.createElement("div");
        firstLineDiv.innerText =
            "평균연봉 : " + exist[selectedText].salary + " / 연수 : " + exist[selectedText].year;
        secondLineDiv.innerText =
            "총 인원 : " +
            exist[selectedText].totalWorker +
            " / 퇴사: " +
            exist[selectedText].exWorker +
            " / 입사 " +
            exist[selectedText].inWorker;

        content.appendChild(firstLineDiv);
        content.appendChild(secondLineDiv);
    } else {
        //콤보박스 생성
        //검색해서 나온 회사 목록 선택하도록 콤보박스에 입력
        const searchResult = await getCompanys(selectedText, null).catch(console.error);

        //검색 결과 0개 > 회사 정보 없음
        //검색 결과 1개 초과 > 회사 목록 출력하고 하나 선택하고 버튼 클릭시 해당 회사 조회
        //검색 결과가 1개 > 바로 회사 정보 불러옴, 블락기업이면 블락이라고 표시

        switch (searchResult.status) {
            case "SEARCH_FAIL":
                resultMsgDiv.innerText = "검색 결과가 없습니다";
                content.appendChild(resultMsgDiv);
                break;
            case "SEARCH_BLOCK":
                resultMsgDiv.innerText = "비공개 기업입니다";
                content.appendChild(resultMsgDiv);
                break;
            case "SEARCH_SUCCESS":
                let res = searchResult.result;
                //storage 저장

                let firstLineDiv = document.createElement("div");
                let secondLineDiv = document.createElement("div");
                firstLineDiv.innerText = "평균연봉 : " + res.salary + " / 연수 : " + res.year;
                secondLineDiv.innerText =
                    "총 인원 : " +
                    res.totalWorker +
                    " / 퇴사: " +
                    res.exWorker +
                    " / 입사 " +
                    res.inWorker;

                content.appendChild(firstLineDiv);
                content.appendChild(secondLineDiv);
                await setStorageData({ [selectedText]: res });
                // await setStorageData({ test: res });

                break;
            case "SEARCH_LIST":
                const compNameSel = document.createElement("select");
                compNameSel.setAttribute("id", "");

                for (var i = 0; i < companyList.length; i++) {
                    var compNameOption = document.createElement("option");
                    compNameOption.value = i;
                    compNameOption.text = companyList[i].company;
                    compNameSel.options.add(compNameOption);
                }

                content.appendChild(compNameSel);
                break;
            default:
                break;
        }
    }
}

// async function getSelectionText() {
//     await chrome.storage.sync.get("companyName", async function (items) {
//         if (!chrome.runtime.error) {
//             console.log(items);
//             document.getElementById("info").innerText = selectedText[0];
//         }
//     });
// }

// document.body.onload = async function() {
//     // await setSelectionText();
//     // await getSelectionText();
//     await test1();
//     await test2();

// }

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
