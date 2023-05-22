const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const cors = require('@koa/cors');

let corsOptions = {
    origin: '*',
    credentials: true,
} 
app.proxy = true;
app.use(cors(corsOptions));

const router = new Router();

router.get('/', (ctx, next) => {
    ctx.body = '홈';
});

const api = require('./routes/searchapi.js');
 
router.use('/api', api.routes());


app.use(router.routes());
app.use(router.allowedMethods());


app.listen(3000, () => {
    console.log('heurm server is listening to port 3000');
});




// // const searchRouter = require('./routes/searchapi');
// // app.use(searchRouter.routes());

// app.listen(3000);