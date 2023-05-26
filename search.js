// selenium import
const { Builder, By, until, Key } = require("selenium-webdriver");

const url = "https://kreditjob.com/board";

//첫 번째 API
const findCompanyList = async (searchCompName, index) => {
    //브라우저 설정
    let driver = await new Builder("./chromedriver").forBrowser("chrome").build();
    //url 접속
    await driver.get(url);
    // const searchSelector = 'input.hmxpFE';
    const searchDivXpath = '//*[@id="__next"]/div/nav/div/div[2]/div';
    const searchPlaceHolder = "//input[contains(@placeholder,'기업을 검색')]";
    const searchInputUpper =
        "//input[contains(@placeholder,'기업을 검색')]/following-sibling::div/ul";
    const modalcloseXpath = "//*[@class='modalContainer']//button[1]";

    if (searchCompName == null) searchCompName = "영림임업";

    let companyList = new Array();
    //검색창 대기
    await driver.wait(until.elementLocated(By.xpath(searchDivXpath)));

    // const modalclosebutton = await driver.findElement(By.xpath(modalcloseXpath));
    // if (modalclosebutton != null) {
    //     modalclosebutton.click(); //팝업창 닫기
    // }
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
            return null;
        }

        // for (let i = 0; i < searchItems.length; i++) {
        //     let item = await searchItems[i].getText();
        //     companyList.push(item);
        // }

        //회사가 한 개만 나오면 클릭
        if (searchItems.length == 1) {
            await searchItems[0].click();

            const salaryXpath =
                "//*[@id='company-summary']//span[contains(text(),'예상평균연봉')]/../following-sibling::div//span[1]";

            await driver.wait(until.elementLocated(By.xpath(salaryXpath)));
            const salary = await driver.findElement(By.xpath(salaryXpath));
            const result = await salary.getText();
            return result;
        }
    }

    return companyList;
};

const getCompanyInfo = async () => {
    //블락도 고려
    // //*span[contains(text(), '예상평균연봉')]/parent::div/following-sibling::div//span[1]
};

//두 번째 API

//~회사명 입력, 일치하는 회사 클릭

//블락회사인지 아닌지 확인, 블락 아닐 경우 인원수, 입사율, 퇴사율, 년수, 평균연봉 조회

//Job담 있으면 Job담 조회
// (async () => {
//     await findCompanyList();
// })();

module.exports = findCompanyList;
