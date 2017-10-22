const KoaRouter = require('koa-router')

const router = new KoaRouter()

router.get('teamInvitation', '/team/:id/new', async ctx => {
  const invitation = ctx.orm.teamInvitation.build()
  await ctx.render('/invitations/newTeamInvitaton', {
    invitation,
    currentUser: ctx.state.currentUser,
    sendInvitationUrl: ctx.router.url('sendInvitation', ctx.params.id),
  })
})

router.post('sendInvitation', '/team/:id/', async ctx => {
  const reciever = await ctx.orm.users.findOne({
    where: {
      username: ctx.request.body.to,
    },
  })
  if (reciever) {
    try {
      await ctx.orm.teamInvitation.create({
        teamId: ctx.params.id,
        userId: reciever.id,
        author: ctx.state.currentUser.username,
      })
      ctx.flashMessage.notice = `La invitación fue enviada a ${reciever.username}`
      ctx.redirect(ctx.router.url('team', { id: ctx.params.id }))
    } catch (validationError) {
      await ctx.render('/invitations/newTeamInvitaton', {
        currentUser: ctx.state.currentUser,
        errors: validationError.errors,
        sendInvitationUrl: ctx.router.url('sendInvitation', ctx.params.id),
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
})

module.exports = router
