const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const welcome = require('./routes/welcome');

const router = new KoaRouter();

router.use('/', welcome.routes());
router.use('/hello', hello.routes());

module.exports = router;
