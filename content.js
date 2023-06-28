const SEARCH_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="12" height="12"><path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z"></path></svg>';
const PEOPLE_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="12" height="12"><path d="M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4 4 0 0 0-7.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.493 3.493 0 0 1 2 5.5ZM11 4a3.001 3.001 0 0 1 2.22 5.018 5.01 5.01 0 0 1 2.56 3.012.749.749 0 0 1-.885.954.752.752 0 0 1-.549-.514 3.507 3.507 0 0 0-2.522-2.372.75.75 0 0 1-.574-.73v-.352a.75.75 0 0 1 .416-.672A1.5 1.5 0 0 0 11 5.5.75.75 0 0 1 11 4Zm-5.5-.5a2 2 0 1 0-.001 3.999A2 2 0 0 0 5.5 3.5Z"></path></svg>';
const UP_TRIANGLE_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 16" width="18" height="18" fill="blue"><path d="m12.354 8.854 5.792 5.792a.5.5 0 0 1-.353.854H6.207a.5.5 0 0 1-.353-.854l5.792-5.792a.5.5 0 0 1 .708 0Z"></path></svg>';
const DONW_TRIANGLE_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 16" width="18" height="18" fill="red"><path d="M11.646 15.146 5.854 9.354a.5.5 0 0 1 .353-.854h11.586a.5.5 0 0 1 .353.854l-5.793 5.792a.5.5 0 0 1-.707 0Z"></path></svg>';

const getStorageData = (key) =>
    new Promise((resolve, reject) =>
        chrome.storage.sync.get(key, (result) =>
            chrome.runtime.lastError
                ? reject(Error(chrome.runtime.lastError.message))
                : resolve(result)
        )
    );
const setStorageData = (data) =>
    new Promise((resolve, reject) =>
        chrome.storage.sync.set(data, () =>
            chrome.runtime.lastError ? reject(Error(chrome.runtime.lastError.message)) : resolve()
        )
    );
const isSearchButton = async (elem) => {
    return elem.matches(".search_company_btn");
};

const findCompName = async (li) => {
    return li.querySelector("div.job-card-company-name").innerHTML;
};
const findCompNameByLi = async (li) => {
    return li.querySelector("div.job-card-company-name").innerHTML;
};

const findCompNameBySpan = async (a) => {
    return a.querySelector("span").innerHTML;
};

const regexName = async (e) => {
    e = e.toString();
    e = e.replace("(주)", "");
    e = e.replace("주식회사", "");
    e = e.replace(/\(.*\)/gi, "");
    e = e.replace(/ /gi, "");
    return e.trim();
};

async function getCompanys(name, index) {
    const companysUrl = "http://localhost:3000/api/search?name=" + name + "&index=" + index;
    const res = await fetch(companysUrl);
    const data = await res.json();
    return data;
}

async function searchCompany(type, li, index) {
    // const li = target.parentNode.parentNode;
    let compName = "";

    //하단 div 생성
    const content = document.createElement("div");

    if (type == "wanted") {
        compName = await findCompName(li);
        compName = await regexName(compName);
        if (li.querySelector("div.search_company") != null) {
            li.removeChild(li.querySelector("div.search_company"));
        }
        content.className = "search_company";
    } else if (type == "saramin") {
        compName = await findCompNameBySpan(li); //a 태그
        compName = await regexName(compName);
        if (li.nextElementSibling.matches("div.search_company_saramin")) {
            li.parentNode.removeChild(li.nextElementSibling);
        }
        content.className = "search_company_saramin";
    }

    if (li != "") {
        //버튼 클릭시
        console.log("click");

        //콤보박스 생성
        //검색해서 나온 회사 목록 선택하도록 콤보박스에 입력
        let searchResult = await getCompanys(compName, index).catch(console.error);

        if (searchResult == undefined) {
            searchResult = {
                status: "SEARCH_FAIL",
            };
        }
        //검색 결과 0개 > 회사 정보 없음
        //검색 결과 1개 초과 > 회사 목록 출력하고 하나 선택하고 버튼 클릭시 해당 회사 조회
        //검색 결과가 1개 > 바로 회사 정보 불러옴, 블락기업이면 블락이라고 표시
        console.log(searchResult.status);
        switch (searchResult.status) {
            case "SEARCH_FAIL":
                content.innerText = "검색 결과가 없습니다";
                // await setStorageData({ [compName]: searchResult.status });
                break;
            case "SEARCH_BLOCK":
                content.innerText = "비공개 기업입니다";
                await setStorageData({ [compName]: searchResult.status });
                break;
            case "SEARCH_SUCCESS":
                let res = searchResult.result;
                //storage 저장
                addCompInfo(content, res);
                await setStorageData({ [compName]: res });

                break;
            case "SEARCH_LIST":
                const compNameSel = document.createElement("select");
                compNameSel.setAttribute("id", "companySelect");
                var compNameOption = document.createElement("option");
                compNameOption.value = "none";
                compNameOption.text = "선택";
                compNameOption.selected = true;
                compNameSel.options.add(compNameOption);
                for (var i = 0; i < searchResult.result.length; i++) {
                    compNameOption = document.createElement("option");
                    compNameOption.value = i;
                    compNameOption.text = searchResult.result[i].company;
                    compNameSel.options.add(compNameOption);
                }

                compNameSel.onchange = async (e) => {
                    if (compNameSel.options[compNameSel.selectedIndex].value != "none") {
                        console.log(compNameSel.selectedIndex - 1);
                        await searchCompany(type, li, compNameSel.selectedIndex - 1);
                    }
                };

                content.append(compNameSel);
                break;
            default:
                break;
        }

        if (type == "saramin") {
            //a 태그 밑에 div search_company_saramin
            li.after(content);
        } else if (type == "wanted") {
            //li 자식 중 가장 끝에 추가
            li.append(content);
        }
    }
}

document.querySelector("body").addEventListener("click", async (event) => {
    let target = "";
    if (await isSearchButton(event.target)) {
        target = event.target;
    } else if (await isSearchButton(event.target.parentNode)) {
        target = event.target.parentNode;
    } else if (await isSearchButton(event.target.parentNode.parentNode)) {
        target = event.target.parentNode.parentNode;
    }

    if (target != "") {
        const div = target.parentNode;
        if (div.matches(".search_company_saramin")) {
            await searchCompany("saramin", div.parentNode.querySelector("a"));
        } else {
            await searchCompany("wanted", div.parentNode);
        }
    }
});

async function addCompInfo(content, data) {
    const span = document.createElement("span");
    if (data == "SEARCH_BLOCK") {
        span.innerHTML = "비공개 기업입니다";
    } else if (data == "SEARCH_FAIL") {
    } else if (data != undefined && data.salary != undefined) {
        span.innerHTML =
            //"평균연봉 : 5,156만원 / 연수 : 6년 (2017) 총 인원 : 53명 / 퇴사: 5명 / 입사 28명";
            "평균연봉 : " +
            data.salary +
            " / 연수 : " +
            data.year +
            "<br/>" +
            PEOPLE_SVG +
            " " +
            data.totalWorker +
            UP_TRIANGLE_SVG +
            " " +
            data.inWorker +
            DONW_TRIANGLE_SVG +
            " " +
            data.exWorker;
    }

    //li
    content.append(span);
}

const addSearchBar = async (action) => {
    if (!action.querySelector("div.search_company")) {
        const content = document.createElement("div");
        content.className = "search_company";

        let compName = await findCompNameByLi(action);

        if (compName != null && compName != undefined && compName != "") {
            compName = await regexName(compName);
            //데이터 있으면
            let exist = await getStorageData(compName);
            if (exist[compName] != undefined) {
                await addCompInfo(content, exist[compName]);
            } else {
                //데이터 없으면 검색 버튼
                const btn = document.createElement("button");
                btn.setAttribute("title", "Search Company");
                btn.className = "search_company_btn";
                btn.innerHTML = SEARCH_SVG;
                content.append(btn);
            }

            action.append(content);
        }
    }
};

const addSearchBarSaramin = async (action) => {
    //a 태그
    if (!action.nextElementSibling.querySelector("div.search_company_saramin")) {
        const content = document.createElement("div");
        content.className = "search_company_saramin";
        let compName = await findCompNameBySpan(action);

        if (compName != null && compName != undefined && compName != "") {
            compName = await regexName(compName);
            //데이터 있으면
            let exist = await getStorageData(compName);
            if (exist[compName] != undefined) {
                addCompInfo(content, exist[compName]);
            } else {
                //데이터 없으면 검색 버튼
                const btn = document.createElement("button");
                btn.setAttribute("title", "Search Company");
                btn.className = "search_company_btn";
                btn.innerHTML = SEARCH_SVG;
                content.append(btn);
            }

            action.after(content);
        }
    }
};

//wanted 됨
//background에서 메세지 날리면 해당되는 액션 실행
//job 공고 밑에 돋보기 혹은 이미 검색한 적 있는 회사 정보 표시
chrome.runtime.onMessage.addListener(function (msg) {
    if (msg.action === "wanted") {
        console.log("wanted");
        //.body
        if (document.querySelectorAll(".body").length > 0) {
            //.body에서 가장 가까운 ul 선택
            const ul = document.querySelectorAll(".body")[0].closest("ul");
            if (ul != undefined) {
                const lis = ul.querySelectorAll("li");
                lis.forEach((action) => {
                    addSearchBar(action);
                });
            }
        }
    } else if (msg.action === "saramin") {
        const jobList = document.querySelectorAll("div.list_item");
        if (jobList.length > 0) {
            jobList.forEach((job) => {
                const compA = job.querySelector("div.company_nm").querySelector("a");
                addSearchBarSaramin(compA);
            });
        }
    }
});

// document.body.appendChild(imageOverlay);
