const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('teams', '/', async (ctx) => {
  const teams = await ctx.orm.team.findAll();
  await ctx.render('teams/index', {
    teams,
    teamPath: team => ctx.router.url('team', { id: team.id }),
    newPath: ctx.router.url('newTeam'),
  });
});

router.get('newTeam', '/new', async (ctx) => {
  const team = ctx.orm.team.build();
  await ctx.render('/teams/new', {
    team,
    createTeamPath: ctx.router.url('createTeamPath'),
  });
});

router.post('createTeamPath', '/', async (ctx) => {
  try {
    const team = await ctx.orm.team.create(ctx.request.body);
    ctx.redirect(ctx.router.url('team', { id: team.id }));
  } catch (validationError) {
    await ctx.render('/teams/new', {
      team: ctx.orm.team.build(ctx.request.body),
      errors: validationError.errors,
      createTeamPath: ctx.router.url('createTeamPath'),
    });
  }
});

router.get('teamEdit', '/:id/edit', async (ctx) => {
  const team = await ctx.orm.team.findById(ctx.params.id);
  await ctx.render('teams/edit', {
    team,
    updateTeamPath: ctx.router.url('teamUpdate', team.id),
  });
});

router.get('team', '/:id', async (ctx) => {
  const team = await ctx.orm.team.findById(ctx.params.id, {
    include: [{
      model: ctx.orm.userTeam,
      include: ctx.orm.users,
    }],
  });
  const members = team.userTeams;
  console.log(members[0]);
  await ctx.render('teams/show', {
    team,
    members,
  });
});

module.exports = router;
