// selenium import
const { Builder, By, until, Key } = require('selenium-webdriver');

const url = 'https://kreditjob.com';

//첫 번째 API 
const findCompanys = async () => {
    let driver = await new Builder('./chromedriver').forBrowser('chrome').build();
    await driver.get(url);
    // const searchSelector = 'input.hmxpFE';
    const searchPlaceHolder = "//input[contains(@placeholder,'기업을 검색')]";
    // await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);

    // await driver.sleep(3000);
    // await driver.wait(until.elementLocated(By.xpath(searchPlaceHolder)));
    // await driver.findElement(By.xpath(searchPlaceHolder));

    await driver.wait(until.elementLocated(By.xpath(searchPlaceHolder)));
    const searchInput = await driver.findElement(By.xpath(searchPlaceHolder));
    searchInput.sendKeys('스페이드컴퍼니', Key.ENTER);

    await driver.sleep(3500);

    await driver.close();
    //__next
    //.sendKeys('스페이드컴퍼니', Key.RETURN);
    // await searchTag.sendKeys(keyword, Key.ENTER);
}
//브라우저 설정

//url 접속

//검색창에 회사명 입력

//회사명, 위치 드롭다운 내용을 리스트로 출력

//두 번째 API

//~회사명 입력, 일치하는 회사 클릭

//블락회사인지 아닌지 확인, 블락 아닐 경우 인원수, 입사율, 퇴사율, 년수, 평균연봉 조회

//Job담 있으면 Job담 조회
(async ()=>{
    await findCompanys();
})();
 