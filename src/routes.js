const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const welcome = require('./routes/welcome');
const sports = require('./routes/sports');
const clubs = require('./routes/clubs');
const teams = require('./routes/teams');

const router = new KoaRouter();

router.use('/', welcome.routes());
router.use('/hello', hello.routes());
router.use('/sports', sports.routes());
router.use('/clubs', clubs.routes());
router.use('/teams', teams.routes());

module.exports = router;
