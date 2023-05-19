const Router = require('koa-router');

const router = new Router({
    prefix: '/search'
});

let companyList = [
    {id: '1', company: "금병영 / 서울, 강동구", link : ""},
    {id: '2', company: "테스트 / 서울, 강북구", link : ""}
]

router.get('/', (ctx, next) => {
    ctx.body = {
        status: 'success',
        companyList: companyList
    }

    next();
});
module.exports = router;

