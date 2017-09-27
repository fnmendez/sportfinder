const KoaRouter = require('koa-router')

const router = new KoaRouter()

router.get('users', '/users', async (ctx) => {
  const users = await ctx.orm.users.findAll()
  return ctx.render('admin/users', {
    users,
    promoteUsersUrl: user => ctx.router.url('promoteUsers', { id: user.id }),
  })
})

router.post('promoteUsers', '/users/:id', async (ctx) => {
  const user = await ctx.orm.users.findById(ctx.params.id)
  await user.update({ role: 0 })
  return ctx.redirect(ctx.router.url('users'))
})

router.delete('deleteUsers', '/users/:id', async (ctx) => {
  const user = await ctx.orm.users.findById(ctx.params.id)
  await user.destroy()
  return ctx.redirect(ctx.router.url('users'))
})

module.exports = router
