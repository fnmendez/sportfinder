const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const welcome = require('./routes/welcome');
const sports = require('./routes/sports');

const router = new KoaRouter();

router.use('/', welcome.routes());
router.use('/hello', hello.routes());
router.use('/sports', sports.routes());

module.exports = router;
