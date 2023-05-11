const Koa = require('koa');
const app = new Koa();

app.listen(3000, () => {
    console.log('heurm server is listening to port 3000');
});

// const Koa = require('koa');
// const KoaBody = require('koa-body');
// const app = new Koa();

// app.use(KoaBody);

// // const searchRouter = require('./routes/searchapi');
// // app.use(searchRouter.routes());

// app.listen(3000);