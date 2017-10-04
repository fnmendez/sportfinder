const KoaRouter = require('koa-router')

const welcome = require('./routes/welcome')
const hello = require('./routes/hello')
const sports = require('./routes/sports')
const clubs = require('./routes/clubs')
const teams = require('./routes/teams')
const matches = require('./routes/matches')
const users = require('./routes/users')
const admin = require('./routes/admin')

const checkAccountConfirmation = require('./routes/checkAccountConfirmation')
const checkLogin = require('./routes/checkLogin')
const checkRole = require('./routes/checkRole')

const router = new KoaRouter()

// public
router.use('/', welcome.routes())
router.use('/hello', hello.routes())

// check login
router.use(checkLogin)

// check account confirmation
router.use(checkAccountConfirmation)

// private
router.use('/sports', sports.routes())
router.use('/clubs', clubs.routes())
router.use('/teams', teams.routes())
router.use('/play', matches.routes())
router.use('/users', users.routes())

// check role
router.use(checkRole)

// admin
router.use('/admin', admin.routes())

module.exports = router
