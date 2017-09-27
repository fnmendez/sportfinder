const checkRole = async (ctx, next) => {
  if (ctx.session.user) {
    const currentUser = await ctx.orm.users.findById(ctx.session.user.id, {
      attributes: ['id', 'username', 'role'],
    })
    if (currentUser && currentUser.isAdmin()) {
      return next()
    }
  }
  ctx.flashMessage.warning = 'No tienes los permisos.'
  ctx.session = null
  return ctx.redirect('home')
}

module.exports = checkRole
