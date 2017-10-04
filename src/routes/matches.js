const KoaRouter = require('koa-router')

const router = new KoaRouter()

router.get('matches', '/', async (ctx) => {
  const matches = await ctx.orm.match.findAll({
    include: [ctx.orm.sport, ctx.orm.club, ctx.orm.userMatch],
    order: [['date', 'ASC']],
  })
  const userMatches = await ctx.orm.userMatch.findAll({
    include: [ctx.orm.users, ctx.orm.match],
  })
  const user = { id: ctx.state.currentUser.id }
  return ctx.render('matches/index', {
    matches,
    userMatches,
    user,
    matchUrl: match => ctx.router.url('match', { id: match.id }),
    newMatchUrl: ctx.router.url('newMatch'),
    profileUrl: '/profile',
    joinMatchUrl: match => ctx.router.url('joinMatch', match.id),
  })
})

router.delete('deleteMatch', '/:id', async (ctx) => {
  const match = await ctx.orm.match.findById(ctx.params.id)
  const currentPlayer = await ctx.orm.userMatch.findOne({
    where: { userId: ctx.state.currentUser.id },
  })
  if ((!currentPlayer || !currentPlayer.isAdmin()) && !ctx.state.currentUser.isAdmin()) {
    ctx.flashMessage.warning = 'No tienes los permisos.'
    return ctx.redirect(ctx.router.url('match', match.id))
  }
  await match.destroy()
  ctx.flashMessage.notice = 'La partida fue eliminada exitosamente.'
  return ctx.redirect(ctx.router.url('matches'))
})

router.get('newMatch', '/new', async (ctx) => {
  const match = ctx.orm.match.build()
  const sports = await ctx.orm.sport.findAll()
  const clubs = await ctx.orm.club.findAll()
  return ctx.render('/matches/new', {
    match,
    sports,
    clubs,
    createMatchUrl: ctx.router.url('createMatch'),
    indexUrl: ctx.router.url('matches'),
  })
})

router.post('createMatch', '/', async (ctx) => {
  try {
    ctx.request.body.date = new Date(ctx.request.body.date)
    const clubSport = await ctx.orm.clubSport.findOne({
      where: {
        clubId: ctx.request.body.clubId,
        sportId: ctx.request.body.sportId,
      },
    })
    if (!clubSport) {
      ctx.flashMessage.warning = 'El club no tiene habilitado ese deporte.'
      return ctx.redirect(ctx.router.url('newMatch'))
    }
    const match = await ctx.orm.match.create(ctx.request.body)
    await ctx.orm.userMatch.create({
      matchId: match.id,
      userId: ctx.state.currentUser.id,
      admin: true,
    })
    return ctx.redirect(ctx.router.url('match', match.id))
  } catch (validationError) {
    const match = ctx.orm.match.build(ctx.request.body)
    const sports = await ctx.orm.sport.findAll()
    const clubs = await ctx.orm.club.findAll()
    return ctx.render('matches/new', {
      match,
      sports,
      clubs,
      errors: validationError.errors,
      createMatchUrl: ctx.router.url('createMatch'),
      indexUrl: ctx.router.url('matches'),
    })
  }
})

router.get('editMatch', '/:id/edit', async (ctx) => {
  const match = await ctx.orm.match.findById(ctx.params.id, {
    include: [ctx.orm.sport, ctx.orm.club],
  })
  const sports = await ctx.orm.sport.findAll()
  const clubs = await ctx.orm.club.findAll()
  return ctx.render('matches/edit', {
    match,
    sports,
    clubs,
    updateMatchUrl: ctx.router.url('updateMatch', match.id),
    showMatchUrl: ctx.router.url('match', match.id),
  })
})

router.patch('updateMatch', '/:id', async (ctx) => {
  const match = await ctx.orm.match.findById(ctx.params.id, {
    include: [ctx.orm.sport, ctx.orm.club],
  })
  const currentPlayer = await ctx.orm.userMatch.findOne({
    where: { userId: ctx.state.currentUser.id },
  })
  if ((!currentPlayer || !currentPlayer.isAdmin()) && !ctx.state.currentUser.isAdmin()) {
    ctx.flashMessage.warning = 'No tienes los permisos.'
    return ctx.redirect(ctx.router.url('match', match.id))
  }
  try {
    const clubSport = await ctx.orm.clubSport.findOne({
      where: {
        clubId: ctx.request.body.clubId,
        sportId: ctx.request.body.sportId,
      },
    })
    if (!clubSport) {
      ctx.flashMessage.warning = 'El club no tiene habilitado ese deporte.'
      return ctx.redirect(ctx.router.url('editMatch', match.id))
    }
    await match.update(ctx.request.body)
    ctx.flashMessage.notice = 'La partida ha sido actualizada.'
    return ctx.redirect(ctx.router.url('match', { id: match.id }))
  } catch (validationError) {
    const sports = await ctx.orm.sport.findAll()
    const clubs = await ctx.orm.club.findAll()
    return ctx.render('matches/edit', {
      match,
      sports,
      clubs,
      errors: validationError.errors,
      updateMatchUrl: ctx.router.url('updateMatch', { id: match.id }),
      showMatchUrl: ctx.router.url('match', match.id),
    })
  }
})

router.post('joinMatch', '/:id/players', async (ctx) => {
  const match = await ctx.orm.match.findById(ctx.params.id)
  const userMatches = await ctx.orm.userMatch.findAll({
    where: { matchId: match.id },
    include: [ctx.orm.users],
  })
  if (userMatches) {
    userMatches.forEach((userMatch) => {
      if (userMatch.user.id === ctx.state.currentUser.id) {
        return ctx.router.redirect('matches')
      }
      return null
    })
  }
  await ctx.orm.userMatch.create({ matchId: match.id, userId: ctx.state.currentUser.id })
  return ctx.redirect(ctx.router.url('match', { id: match.id }))
})

router.post('promotePlayer', '/:matchId/players/:id', async (ctx) => {
  const matchId = ctx.params.matchId
  const currentPlayer = await ctx.orm.userMatch.findOne({
    where: { userId: ctx.state.currentUser.id },
  })
  if (!currentPlayer || !currentPlayer.isAdmin()) {
    ctx.flashMessage.warning = 'No tienes los permisos.'
    return ctx.redirect(ctx.router.url('match', matchId))
  }
  const userMatch = await ctx.orm.userMatch.findById(ctx.params.id)
  await userMatch.update({ admin: true })
  ctx.flashMessage.notice = 'El jugador ha sido promovido correctamente.'
  return ctx.redirect(ctx.router.url('match', matchId))
})

router.delete('removePlayer', '/:matchId/players/:id', async (ctx) => {
  const matchId = ctx.params.matchId
  const currentPlayer = await ctx.orm.userMatch.findOne({
    where: { userId: ctx.state.currentUser.id },
  })
  const player = await ctx.orm.userMatch.findById(ctx.params.id, {
    include: [ctx.orm.users],
  })
  const isCurrentPlayer = player.id === currentPlayer.id
  if (!currentPlayer || (!isCurrentPlayer && !currentPlayer.isAdmin())) {
    ctx.flashMessage.warning = 'No tienes los permisos.'
    return ctx.redirect(ctx.router.url('match', matchId))
  } else if (!player) {
    ctx.flashMessage.warning = 'El jugador no es miembro de la partida.'
    return ctx.redirect(ctx.router.url('match', matchId))
  } else if (!isCurrentPlayer && player.isAdmin()) {
    ctx.flashMessage.warning = 'No puedes eliminar a un administrador de la partida.'
    return ctx.redirect(ctx.router.url('match', matchId))
  } else if (isCurrentPlayer && player.isAdmin()) {
    // if there isn't other admins in match
    // offer to promote a player or delete match
    await player.destroy()
    ctx.flashMessage.notice = 'Has dejado la partida.'
    return ctx.redirect(ctx.router.url('matches'))
  } else if (!isCurrentPlayer && currentPlayer.isAdmin()) {
    await player.destroy()
    ctx.flashMessage.notice = 'El jugador fue eliminado correctamente.'
    return ctx.redirect(ctx.router.url('match', matchId))
  }
  // currentPlayer && !currentPlayer.isAdmin()
  await player.destroy()
  ctx.flashMessage.notice = 'Has dejado la partida.'
  return ctx.redirect(ctx.router.url('matches'))
})

// router.patch('setPosition', '/:matchId/players/:id', async (ctx) => {
//   const matchId = ctx.params.matchId
//   const thisPlayer = await ctx.orm.userMatch.findById(ctx.params.id)
//   try {
//     await thisPlayer.update({ positionId: ctx.request.body.positionId })
//     ctx.flashMessage.notice = 'Tu posición se ha actualizado correctamente.'
//     return ctx.redirect(ctx.router.url('match', matchId))
//   } catch (validationError) {
//     ctx.flashMessage.warning = 'Ha ocurrido un error mientras se actualizaba tu posición.'
//     return ctx.redirect(ctx.router.url('match', matchId))
//   }
// })

router.get('match', '/:id', async (ctx) => {
  const match = await ctx.orm.match.findById(ctx.params.id, {
    include: [{
      model: ctx.orm.sport,
    }, {
      model: ctx.orm.club,
      include: [ctx.orm.clubSport],
    }, {
      model: ctx.orm.userMatch,
    }],
  })
  const players = await ctx.orm.userMatch.findAll({
    where: { matchId: match.id },
    include: [ctx.orm.users],
  })
  let currentPlayer = await ctx.orm.userMatch.findOne({
    where: { userId: ctx.state.currentUser.id },
  })
  if (!currentPlayer) {
    currentPlayer = { id: -1, isAdmin() { return false } }
  }
  return ctx.render('matches/show', {
    match,
    currentPlayer,
    currentUser: ctx.state.currentUser,
    players,
    promotePlayerUrl: player => ctx.router.url('promotePlayer', {
      matchId: match.id,
      id: player.id,
    }),
    removePlayerUrl: player => ctx.router.url('removePlayer', {
      matchId: match.id,
      id: player.id,
    }),
    editMatchUrl: ctx.router.url('editMatch', match.id),
    deleteMatchUrl: ctx.router.url('deleteMatch', match.id),
    indexUrl: ctx.router.url('matches'),
  })
})

module.exports = router
