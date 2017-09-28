const KoaRouter = require('koa-router')

const router = new KoaRouter()

router.get('matches', '/', async (ctx) => {
  const matches = await ctx.orm.match.findAll({
    include: [ctx.orm.sport, ctx.orm.club],
  })
  const userMatches = await ctx.orm.userMatch.findAll({
    include: [ctx.orm.users, ctx.orm.match],
  })
  const user = { id: ctx.state.currentUser.id }
  await ctx.render('matches/index', {
    matches,
    userMatches,
    user,
    matchUrl: match => ctx.router.url('match', { id: match.id }),
    newMatchUrl: ctx.router.url('newMatch'),
    profileUrl: '/profile',
    joinMatchUrl: match => ctx.router.url('joinMatch', match.id),
    notice: ctx.flashMessage.notice,
  })
})

router.delete('deleteMatch', '/:id', async (ctx) => {
  const match = await ctx.orm.match.findById(ctx.params.id)
  await match.destroy()
  ctx.flashMessage.notice = 'La partida fue eliminada exitosamente.'
  await ctx.redirect(ctx.router.url('matches'))
})

router.get('newMatch', '/new', async (ctx) => {
  const match = ctx.orm.match.build()
  const sports = await ctx.orm.sport.findAll()
  const clubs = await ctx.orm.club.findAll()
  await ctx.render('/matches/new', {
    match,
    sports,
    clubs,
    createMatchUrl: ctx.router.url('createMatch'),
    indexUrl: ctx.router.url('matches'),
  })
})

router.post('createMatch', '/', async (ctx) => {
  try {
    const match = await ctx.orm.match.create(ctx.request.body)
    ctx.redirect(ctx.router.url('match', match.id))
  } catch (validationError) {
    const match = ctx.orm.match.build(ctx.request.body)
    const sports = await ctx.orm.sport.findAll()
    const clubs = await ctx.orm.club.findAll()
    await ctx.redirect('newMatch', {
      match,
      sports,
      clubs,
      errors: validationError.errors,
      createMatchUrl: ctx.router.url('createMatch'),
    })
  }
})

router.get('editMatch', '/:id/edit', async (ctx) => {
  const match = await ctx.orm.match.findById(ctx.params.id, {
    include: [ctx.orm.sport, ctx.orm.club],
  })
  const sports = await ctx.orm.sport.findAll()
  const clubs = await ctx.orm.club.findAll()
  await ctx.render('matches/edit', {
    match,
    sports,
    clubs,
    updateMatchUrl: ctx.router.url('updateMatch', match.id),
    showMatchUrl: ctx.router.url('match', match.id),
  })
})

router.patch('updateMatch', '/:id', async (ctx) => {
  // const match = await ctx.orm.match.findById(ctx.params.id);
  const match = await ctx.orm.match.findById(ctx.params.id, {
    include: [ctx.orm.sport, ctx.orm.club],
  })
  try {
    await match.update(ctx.request.body)
    ctx.flashMessage.notice = 'La partida ha sido actualizada.'
    ctx.redirect(ctx.router.url('match', { id: match.id }))
  } catch (validationError) {
    const sports = await ctx.orm.sport.findAll()
    const clubs = await ctx.orm.club.findAll()
    await ctx.render('matches/edit', {
      match,
      sports,
      clubs,
      errors: validationError.errors,
      updateMatchUrl: ctx.router.url('updateMatch', { id: match.id }),
      showMatchUrl: ctx.router.url('match', match.id),
    })
  }
})

router.post('joinMatch', '/:id/join', async (ctx) => {
  const match = await ctx.orm.match.findById(ctx.params.id)
  await ctx.orm.userMatch.create({ matchId: match.id, userId: ctx.state.currentUser.id })
  ctx.redirect(ctx.router.url('match', { id: match.id }))
})

router.get('match', '/:id', async (ctx) => {
  const match = await ctx.orm.match.findById(ctx.params.id, {
    include: [ctx.orm.sport, ctx.orm.club],
  })
  const players = await ctx.orm.userMatch.findAll({
    where: { matchId: match.id },
    include: [ctx.orm.users],
  })
  await ctx.render('matches/show', {
    match,
    players,
    editMatchUrl: ctx.router.url('editMatch', match.id),
    deleteMatchUrl: ctx.router.url('deleteMatch', match.id),
    indexUrl: ctx.router.url('matches'),
    notice: ctx.flashMessage.notice,
  })
})

module.exports = router
