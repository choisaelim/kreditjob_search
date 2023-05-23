const Router = require("koa-router");
const findCompanyList = require("../search");

const router = new Router({
    prefix: "/search",
});

//테스트 데이터
let companyList = [
    { id: "1", company: "금병영 / 서울, 강동구", link: "" },
    { id: "2", company: "테스트 / 서울, 강북구", link: "" },
];

//셀레니움으로 검색해서 나온 회사목록 return
router.get("/", async (ctx, next) => {
    const { name } = ctx.query;
    companyList = await findCompanyList(name);
    ctx.body = {
        status: "success",
        companyList: companyList,
    };

    next();
});
module.exports = router;
