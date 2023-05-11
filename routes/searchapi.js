const Router = require('koa-router');
const router = new Router({
    prefix: '/search'
});

let companyList = [
    {id: 0, compName: "금병영", compAddr: "서울, 강동구"}
]

router.get('/', (ctx, next) => {
    ctx.body = {
        status: 'success',
        companyList: companyList
    }

    next();
});

module.exports = router;