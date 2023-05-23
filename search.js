// selenium import
const { Builder, By, until, Key } = require("selenium-webdriver");

const url = "https://kreditjob.com/company/cd99815e9f642bf16e37480bee30814b41bf8a50";

//첫 번째 API
const findCompanyList = async (searchCompName) => {
    //브라우저 설정
    let driver = await new Builder("./chromedriver").forBrowser("chrome").build();
    //url 접속
    await driver.get(url);
    // const searchSelector = 'input.hmxpFE';
    const searchDivXpath = '//*[@id="__next"]/div/nav/div/div[2]/div';
    const searchPlaceHolder = "//input[contains(@placeholder,'기업을 검색')]";
    const searchInputUpper =
        "//input[contains(@placeholder,'기업을 검색')]/following-sibling::div/ul";

    if (searchCompName == null) searchCompName = "스페이드컴퍼니";

    let companyList = new Array();
    //검색창 대기
    await driver.wait(until.elementLocated(By.xpath(searchDivXpath)));
    //검색창 클릭해서 input 활성화
    const searchDiv = await driver.findElement(By.xpath(searchDivXpath));
    await searchDiv.click();

    //검색창에 회사명 입력
    const searchInputs = await driver.findElements(By.xpath(searchPlaceHolder));
    if (searchInputs.length > 0) {
        const searchTopInput = searchInputs[0];
        await searchTopInput.sendKeys(searchCompName, Key.ENTER);

        await searchTopInput.click();

        //회사명, 위치 드롭다운 내용을 리스트로 출력
        await driver.sleep(1000);
        const searchList = await driver.findElement(By.xpath(searchInputUpper));
        const searchItems = await searchList.findElements(By.css("li"));

        if (searchItems.length == 0) {
            console.log("검색 결과가 없습니다");
        }
        for (let i = 0; i < searchItems.length; i++) {
            let item = await searchItems[i].getText();
            companyList.push(item);
        }
    }
    await driver.close();
    return companyList;
};

//두 번째 API

//~회사명 입력, 일치하는 회사 클릭

//블락회사인지 아닌지 확인, 블락 아닐 경우 인원수, 입사율, 퇴사율, 년수, 평균연봉 조회

//Job담 있으면 Job담 조회
(async () => {
    await findCompanyList();
})();

module.exports = findCompanyList;
