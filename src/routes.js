const KoaRouter = require('koa-router');

const welcome = require('./routes/welcome');
const hello = require('./routes/hello');
const checkLogin = require('./routes/checkLogin');
const sports = require('./routes/sports');
const clubs = require('./routes/clubs');
const teams = require('./routes/teams');
const matches = require('./routes/matches');

const router = new KoaRouter();

// public
router.use('/', welcome.routes());
router.use('/hello', hello.routes());

// check login
router.use(checkLogin);

// private
router.use('/sports', sports.routes());
router.use('/clubs', clubs.routes());
router.use('/teams', teams.routes());
router.use('/play', matches.routes());

module.exports = router;
