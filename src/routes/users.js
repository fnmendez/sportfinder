const KoaRouter = require('koa-router')

const router = new KoaRouter()

router.get('user', '/:id', async ctx => {
  const user = await ctx.orm.users.findById(ctx.params.id, {
    attributes: { exclude: ['password'] },
  })
  return ctx.render('users/profile', {
    user,
  })
})

module.exports = router
