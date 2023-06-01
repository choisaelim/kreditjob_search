async function getCompanys(name, index) {
    const companysUrl = "http://localhost:3000/api/search?name" + name + "&index=" + index;
    const res = await fetch(companysUrl);
    const data = await res.json();
    if (data.status === "success") {
        console.log(data.companyList);
        return data.companyList;
    } else {
        return "검색 결과가 없습니다";
    }
}

document.getElementById("onclicked-button").addEventListener("click", async () => {
    await updateCompanyInfo();
});

async function updateCompanyInfo() {
    await chrome.storage.sync.get("companyName", async function (items) {
        if (!chrome.runtime.error) {
            const info = document.getElementById("info");
            //이미 생성된 회사 정보가 있으면 지우고 새로 생성
            if (document.getElementById("popupContent") != null) {
                info.removeChild(document.getElementById("popupContent"));
            }
            const content = document.createElement("div");
            content.id = "popupContent";
            info.appendChild(content);
            const compNameDiv = document.createElement("div");
            compNameDiv.innerText = items.companyName;
            //사용자가 마우스로 선택한 회사 이름 표시
            content.appendChild(compNameDiv);

            //콤보박스 생성
            const compNameSel = document.createElement("select");
            content.appendChild(compNameSel);
            //검색해서 나온 회사 목록 선택하도록 콤보박스에 입력
            const companyList = await getCompanys(items.companyName, null).catch(console.error);

            //검색 결과 0개 > 회사 정보 없음
            //검색 결과 1개 초과 > 회사 목록 출력하고 하나 선택하고 버튼 클릭시 해당 회사 조회
            //검색 결과가 1개 > 바로 회사 정보 불러옴, 블락기업이면 블락이라고 표시

            debugger;
            for (var i = 0; i < companyList.length; i++) {
                var compNameOption = document.createElement("option");
                compNameOption.value = i;
                compNameOption.text = companyList[i].company;
                compNameSel.options.add(compNameOption);
            }
        }
    });
}

// async function getSelectionText() {
//     await chrome.storage.sync.get("companyName", async function (items) {
//         if (!chrome.runtime.error) {
//             console.log(items);
//             document.getElementById("info").innerText = items.companyName;
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
