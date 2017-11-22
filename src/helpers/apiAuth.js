module.exports = async (ctx, next) => {
  if (ctx.request.headers.authorization) {
    const apiUser = await ctx.orm.users.findOne(
      { key: ctx.request.headers.authorization },
      {
        attributes: [
          'id',
          'username',
          'role',
          'confirmed',
          'photoId',
          'hasPendingEvaluations',
        ],
      }
    )
    ctx.state = { ...ctx.state, apiUser }
  }
  return next()
}
