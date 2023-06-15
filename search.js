// selenium import
const { Builder, By, until, Key } = require("selenium-webdriver");
const chromeDriver = require("selenium-webdriver/chrome");
const chromeOptions = new chromeDriver.Options();
const { SEARCH_LIST, SEARCH_SUCCESS, SEARCH_FAIL, SEARCH_BLOCK } = require("./const");

const url = "https://insight.wanted.co.kr/salaryreport/step";

const testapi = async (searchCompName, index) => {
    chromeOptions.addArguments("--headless");
    chromeOptions.addArguments("--disable-gpu");
    chromeOptions.addArguments("--no-sandbox");
    chromeOptions.addArguments("--lang=ko_KR");
    chromeOptions.addArguments(
        "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    );
    let driver = await new Builder("./chromedriver")
        .forBrowser("chrome")
        .setChromeOptions(chromeOptions)
        .build();

    await driver.get(
        "https://insight.wanted.co.kr/company/08919f50df9f8b30594f71ba6e3001b5a4434c3e/summary"
    );
    const pageSource = await driver
        .wait(until.elementLocated(By.css("body")), 1000)
        .getAttribute("innerHTML");
    return pageSource;
};

//첫 번째 API
const findCompanyList = async (searchCompName, index) => {
    chromeOptions.addArguments("--headless");
    chromeOptions.addArguments("--disable-gpu");
    chromeOptions.addArguments("--no-sandbox");
    chromeOptions.addArguments("--lang=ko_KR");
    // chromeOptions.addArguments("--start-maximized");
    chromeOptions.addArguments(
        "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    );
    let driver = await new Builder("./chromedriver")
        .forBrowser("chrome")
        .setChromeOptions(chromeOptions)
        .build();

    //url 접속
    await driver.get(url);
    // const searchSelector = 'input.hmxpFE';
    //*[@id="__next"]/div/nav/div/div[2]/div/div[2]/input
    const searchDivXpath = '//*[@id="__next"]/div/nav/div/div[2]/div';
    const searchButtonXpath = '//*[@id="__next"]/div/nav/div/div[2]/div';
    const searchPlaceHolder = "//input[contains(@placeholder,'기업을')]";
    const searchInputUpper = "//input[contains(@placeholder,'기업을')]/..//ul";
    ///following-sibling::div/ul
    const modalcloseXpath = "//*[@class='modalContainer']//button[1]";

    if (searchCompName == null || searchCompName == undefined || searchCompName == "")
        searchCompName = "영림임업";

    let result = {
        status: SEARCH_FAIL,
    };

    try {
        //검색창 대기
        await driver.wait(until.elementLocated(By.xpath(searchButtonXpath)), 3000);
        const searchButton = await driver.findElement(By.xpath(searchButtonXpath));
        await searchButton.click();
        // await driver.sleep(3000);
        // const modalclosebutton = await driver.findElement(By.xpath(modalcloseXpath));
        // if (modalclosebutton != null) {
        //     modalclosebutton.click(); //팝업창 닫기
        // }
        //검색창 클릭해서 input 활성화
        const searchDiv = await driver.findElement(By.xpath(searchPlaceHolder));
        await searchDiv.click();

        //검색창에 회사명 입력
        const searchInputs = await driver.findElements(By.xpath(searchPlaceHolder));
        if (searchInputs.length > 0) {
            const searchTopInput = searchInputs[0];
            await searchTopInput.sendKeys(searchCompName, Key.ENTER);

            await searchTopInput.click();

            //회사명, 위치 드롭다운 내용을 리스트로 출력
            const pageSource = await driver
                .wait(until.elementLocated(By.css("body")), 1000)
                .getAttribute("innerHTML");

            // return pageSource;
            // await driver.sleep(3000);
            const searchList = await driver.findElement(By.xpath(searchInputUpper));
            // return searchList.getAttribute("innerHTML");
            const searchItems = await searchList.findElements(By.css("li"));

            if (searchItems.length == 0) {
                return result;
            }

            //인덱스가 있으면 인덱스 클릭
            //인덱스 없고 리스트 > 1 이면 그냥 companyList return
            //리스트 1이면 0 클릭
            if (searchItems.length > 1 && isNaN(index)) {
                //index 없는데 searchItem 여러개(같은 이름 회사 여러개)
                let companyList = new Array();
                for (let i = 0; i < searchItems.length; i++) {
                    let item = await searchItems[i].getText();
                    companyList.push({
                        id: i,
                        company: item,
                    });
                }
                result = {
                    status: SEARCH_LIST,
                    result: companyList,
                };
                driver.close();
                return result;
            } else {
                if (searchItems.length == 1) {
                    const test = searchItems[0];
                    await test.click();
                } else if (!isNaN(index)) {
                    await searchItems[index].click();
                }

                if (searchItems.length == 1 || !isNaN(index)) {
                    const yearXpath =
                        "//*[@id='__next']/div/main/section/section/div[1]/div[2]/div/div[2]/span[1]";

                    const salaryXpath =
                        "//span[contains(text(),'예상평균연봉')]/../following-sibling::div//span[1]";
                    const workerXpath =
                        "//span[contains(text(),'총 인원')]/../following-sibling::div//span[1]";
                    const exitXpath =
                        "//span[contains(text(),'총 인원')]/../following-sibling::div//span[2]";
                    const inXpath =
                        "//span[contains(text(),'총 인원')]/../following-sibling::div/div[2]/div[2]/span[2]";

                    await driver.wait(until.elementLocated(By.xpath(salaryXpath)), 3000);
                    const year = await driver.findElement(By.xpath(yearXpath)).getText();
                    const salary = await driver.findElement(By.xpath(salaryXpath)).getText();

                    if (salary == "비공개") {
                        result = {
                            status: SEARCH_BLOCK,
                        };
                    } else {
                        const totalWorker = await driver
                            .findElement(By.xpath(workerXpath))
                            .getText();
                        const exWorker = await driver.findElement(By.xpath(exitXpath)).getText();
                        const inWorker = await driver.findElement(By.xpath(inXpath)).getText();
                        result = {
                            status: SEARCH_SUCCESS,
                            result: {
                                salary: salary,
                                totalWorker: totalWorker,
                                exWorker: exWorker,
                                inWorker: inWorker,
                                year: year,
                            },
                        };
                    }
                    driver.close();
                    return result;
                }
            }
        }
    } catch (error) {
        driver.close();
        return result;
    }
};

//Job담 있으면 Job담 조회
// (async () => {
//     await findCompanyList();
// })();

module.exports = findCompanyList;
