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

router.del('deleteTeam', '/:id', async (ctx) => {
  const team = await ctx.orm.team.findById(ctx.params.id);
  const teams = await ctx.orm.team.findAll();
  await team.destroy();

  await ctx.redirect(ctx.router.url('teams', {
    teams,
    teamPath: team => ctx.router.url('team', team.id),
    newPath: ctx.router.url('newTeam'),
  }));
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
    showUrl: ctx.router.url('team', team.id),
  });
});

router.patch('teamUpdate', '/:id', async (ctx) => {
  const team = await ctx.orm.team.findById(ctx.params.id);
  try {
    await team.update(ctx.request.body);
    ctx.redirect(ctx.router.url('team', { id: team.id }));
  } catch (validationError) {
    await ctx.render('teams/edit', {
      team,
      errors: validationError.errors,
      updateTeamPath: ctx.router.url('teamUpdate', { id: team.id }),
    });
  }
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
    editTeamPath: ctx.router.url('teamEdit', team.id),
    deleteTeamPath: ctx.router.url('deleteTeam', team.id),
    indexUrl: ctx.router.url('teams'),
  });
});

module.exports = router;
