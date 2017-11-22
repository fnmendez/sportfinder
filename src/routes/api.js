const KoaRouter = require('koa-router')

const router = new KoaRouter()

router.get('sports', '/sports', async ctx => {})
router.get('clubs', '/clubs', async ctx => {})
router.get('teams', '/teams', async ctx => {})
router.get('matches', '/matches', async ctx => {})
router.post('createTeam', '/teams', async ctx => {})
router.post('createMatch', '/matches', async ctx => {})
router.post('createTeam', '/teams', async ctx => {})
router.post('createMatch', '/matches', async ctx => {})

module.exports = router
