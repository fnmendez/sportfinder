const KoaRouter = require('koa-router')

const router = new KoaRouter()

router.get('clubs', '/', async (ctx) => {
  const clubs = await ctx.orm.club.findAll()
  return ctx.render('clubs/index', {
    clubs,
    isAdmin: ctx.state.currentUser.isAdmin(),
    clubUrl: club => ctx.router.url('club', { id: club.id }),
    newClubUrl: ctx.router.url('newClub'),
    notice: ctx.flashMessage.notice,
    warning: ctx.flashMessage.warning,
  })
})

router.delete('deleteClub', '/:id', async (ctx) => {
  const isAdmin = ctx.state.currentUser.isAdmin()
  if (!isAdmin) {
    ctx.flashMessage.warning = 'No tienes los permisos.'
    return ctx.redirect('clubs')
  }
  const club = await ctx.orm.club.findById(ctx.params.id)
  await club.destroy()
  ctx.flashMessage.notice = 'El club fue eliminado exitosamente.'
  return ctx.redirect(ctx.router.url('clubs'))
})

router.get('newClub', '/new', async (ctx) => {
  const club = ctx.orm.club.build()
  return ctx.render('/clubs/new', {
    club,
    createClubUrl: ctx.router.url('createClub'),
    indexUrl: ctx.router.url('clubs'),
  })
})

router.post('createClub', '/', async (ctx) => {
  const isAdmin = ctx.state.currentUser.isAdmin()
  if (!isAdmin) {
    ctx.flashMessage.warning = 'No tienes los permisos.'
    return ctx.redirect('clubs')
  }
  try {
    const club = await ctx.orm.club.create(ctx.request.body)
    return ctx.redirect(ctx.router.url('club', { id: club.id }))
  } catch (validationError) {
    return ctx.render('/clubs/new', {
      club: ctx.orm.club.build(ctx.request.body),
      errors: validationError.errors,
      createClubUrl: ctx.router.url('createClub'),
      indexUrl: ctx.router.url('clubs'),
    })
  }
})

router.get('editClub', '/:id/edit', async (ctx) => {
  const club = await ctx.orm.club.findById(ctx.params.id)
  return ctx.render('clubs/edit', {
    club,
    updateClubUrl: ctx.router.url('updateClub', club.id),
    showClubUrl: ctx.router.url('club', club.id),
  })
})

router.patch('updateClub', '/:id', async (ctx) => {
  const isAdmin = ctx.state.currentUser.isAdmin()
  if (!isAdmin) {
    ctx.flashMessage.warning = 'No tienes los permisos.'
    return ctx.redirect('clubs')
  }
  const club = await ctx.orm.club.findById(ctx.params.id)
  try {
    await club.update(ctx.request.body)
    ctx.flashMessage.notice = 'El club ha sido actualizado.'
    return ctx.redirect(ctx.router.url('club', { id: club.id }))
  } catch (validationError) {
    return ctx.render('clubs/edit', {
      club,
      errors: validationError.errors,
      updateClubUrl: ctx.router.url('updateClub', { id: club.id }),
      showClubUrl: ctx.router.url('club', club.id),
    })
  }
})

router.get('club', '/:id', async (ctx) => {
  const club = await ctx.orm.club.findById(ctx.params.id, {
    include: [{
      model: ctx.orm.clubSport,
      include: ctx.orm.sport,
    }],
  })
  const clubSports = club.clubSports
  return ctx.render('clubs/show', {
    club,
    clubSports,
    isAdmin: ctx.state.currentUser.isAdmin(),
    deleteClubUrl: ctx.router.url('deleteClub', club.id),
    indexUrl: ctx.router.url('clubs'),
    editClubUrl: ctx.router.url('editClub', club.id),
    notice: ctx.flashMessage.notice,
  })
})

module.exports = router
