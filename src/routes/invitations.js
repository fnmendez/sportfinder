const KoaRouter = require('koa-router')

const router = new KoaRouter()

router.get('teamInvitation', '/team/:id/new', async ctx => {
  const invitation = ctx.orm.teamInvitation.build()
  await ctx.render('/invitations/teams/new', {
    invitation,
    currentUser: ctx.state.currentUser,
    sendInvitationUrl: ctx.router.url('sendTeamInvitation', ctx.params.id),
  })
})

router.get('matchInvitation', '/match/:id/new', async ctx => {
  const invitation = ctx.orm.matchInvitation.build()
  await ctx.render('/invitations/matches/new', {
    invitation,
    currentUser: ctx.state.currentUser,
    sendInvitationUrl: ctx.router.url('sendMatchInvitation', ctx.params.id),
  })
})

router.post('sendTeamInvitation', '/team/:id/', async ctx => {
  const receiver = await ctx.orm.users.findOne({
    where: {
      username: ctx.request.body.to,
    },
  })
  if (receiver) {
    try {
      const joinTuple = await ctx.orm.userTeam.find({
        where: { userId: receiver.id },
      })
      if (!joinTuple) {
        await ctx.orm.teamInvitation.create({
          teamId: ctx.params.id,
          userId: receiver.id,
          author: ctx.state.currentUser.username,
        })
        ctx.flashMessage.notice = `La invitación fue enviada a ${receiver.username}.`
        ctx.redirect(ctx.router.url('team', { id: ctx.params.id }))
      } else {
        ctx.flashMessage.notice = `${receiver.username} ya está en este equipo.`
        ctx.redirect(ctx.router.url('teamInvitation', ctx.params.id))
      }
    } catch (validationError) {
      await ctx.render('/invitations/teams/new', {
        currentUser: ctx.state.currentUser,
        errors: validationError.errors,
        sendInvitationUrl: ctx.router.url('sendTeamInvitation', ctx.params.id),
      })
    }
  }
})

router.post('sendMatchInvitation', '/match/:id/', async ctx => {
  const receiver = await ctx.orm.users.findOne({
    where: {
      username: ctx.request.body.to,
    },
  })
  if (receiver) {
    try {
      await ctx.orm.matchInvitation.create({
        matchId: ctx.params.id,
        userId: receiver.id,
        author: ctx.state.currentUser.username,
      })
      ctx.flashMessage.notice = `La invitación fue enviada a ${receiver.username}`
      ctx.redirect(ctx.router.url('match', { id: ctx.params.id }))
    } catch (validationError) {
      await ctx.render('/invitations/matches/new', {
        currentUser: ctx.state.currentUser,
        errors: validationError.errors,
        sendInvitationUrl: ctx.router.url('sendMatchInvitation', ctx.params.id),
      })
    }
  }
})

router.delete('deleteTeamInvitation', '/team/:id', async ctx => {
  const invitation = await ctx.orm.teamInvitation.findOne({
    where: { userId: ctx.state.currentUser.id, teamId: ctx.params.id },
  })
  if (invitation) {
    invitation.destroy()
  }
  ctx.body = { message: 'OK' }
})
router.delete('deleteMatchInvitation', '/match/:id', async ctx => {
  const invitation = await ctx.orm.matchInvitation.findOne({
    where: { userId: ctx.state.currentUser.id, matchId: ctx.params.id },
  })
  if (invitation) {
    invitation.destroy()
  }
  ctx.body = { message: 'OK' }
})

module.exports = router
