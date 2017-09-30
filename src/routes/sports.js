const KoaRouter = require('koa-router')

const router = new KoaRouter()

router.get('sports', '/', async (ctx) => {
  const sports = await ctx.orm.sport.findAll()
  await ctx.render('sports/index', {
    sports,
    isAdmin: ctx.state.currentUser.isAdmin(),
    sportUrl: sport => ctx.router.url('sport', { id: sport.id }),
    newSportUrl: ctx.router.url('newSport'),
  })
})

router.delete('deleteSport', '/:id', async (ctx) => {
  const isAdmin = ctx.state.currentUser.isAdmin()
  if (!isAdmin) {
    ctx.flashMessage.warning = 'No tienes los permisos.'
    return ctx.redirect('sports')
  }
  const sport = await ctx.orm.sport.findById(ctx.params.id)
  await sport.destroy()
  ctx.flashMessage.notice = 'El deporte fue eliminado exitosamente.'
  return ctx.redirect(ctx.router.url('sports'))
})

router.get('newSport', '/new', async (ctx) => {
  const sport = ctx.orm.sport.build()
  await ctx.render('/sports/new', {
    sport,
    createSportUrl: ctx.router.url('createSport'),
    indexUrl: ctx.router.url('sports'),
  })
})

router.post('createSport', '/', async (ctx) => {
  const isAdmin = ctx.state.currentUser.isAdmin()
  if (!isAdmin) {
    ctx.flashMessage.warning = 'No tienes los permisos.'
    return ctx.redirect('sports')
  }
  try {
    const sport = await ctx.orm.sport.create(ctx.request.body)
    return ctx.redirect(ctx.router.url('sport', { id: sport.id }))
  } catch (validationError) {
    return ctx.render('/sports/new', {
      sport: ctx.orm.sport.build(ctx.request.body),
      errors: validationError.errors,
      createSportUrl: ctx.router.url('createSport'),
      indexUrl: ctx.router.url('sports'),
    })
  }
})

router.get('editSport', '/:id/edit', async (ctx) => {
  const sport = await ctx.orm.sport.findById(ctx.params.id)
  await ctx.render('sports/edit', {
    sport,
    updateSportUrl: ctx.router.url('updateSport', sport.id),
    showUrl: ctx.router.url('sport', sport.id),
  })
})

router.patch('updateSport', '/:id', async (ctx) => {
  const isAdmin = ctx.state.currentUser.isAdmin()
  if (!isAdmin) {
    ctx.flashMessage.warning = 'No tienes los permisos.'
    return ctx.redirect('sports')
  }
  const sport = await ctx.orm.sport.findById(ctx.params.id)
  try {
    await sport.update(ctx.request.body)
    ctx.flashMessage.notice = 'El deporte ha sido actualizado.'
    return ctx.redirect(ctx.router.url('sport', { id: sport.id }))
  } catch (validationError) {
    return ctx.render('sports/edit', {
      sport,
      errors: validationError.errors,
      updateSportUrl: ctx.router.url('updateSport', { id: sport.id }),
      showUrl: ctx.router.url('sport', sport.id),
    })
  }
})

router.post('addPosition', '/:id', async (ctx) => {
  const sport = await ctx.orm.sport.findById(ctx.params.id)
  
})

router.get('sport', '/:id', async (ctx) => {
  const sport = await ctx.orm.sport.findById(ctx.params.id)
  await ctx.render('sports/show', {
    sport,
    isAdmin: ctx.state.currentUser.isAdmin(),
    addPositionUrl: ctx.router.url('addPosition', sport.id),
    removePositionUrl: ctx.router.url('removePosition', sport.id),
    editSportUrl: ctx.router.url('editSport', sport.id),
    deleteSportUrl: ctx.router.url('deleteSport', sport.id),
    indexUrl: ctx.router.url('sports'),
  })
})

module.exports = router
