const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('teams', '/', async (ctx) => {
  const teams = await ctx.orm.team.findAll();
  await ctx.render('teams/index', {
    teams,
    teamUrl: team => ctx.router.url('team', { id: team.id }),
    newTeamUrl: ctx.router.url('newTeam'),
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
  const sports = await ctx.orm.sport.findAll();
  await ctx.render('/teams/new', {
    team,
    sports,
    createTeamUrl: ctx.router.url('createTeam'),
    indexUrl: ctx.router.url('teams'),
  });
});

router.post('createTeam', '/', async (ctx) => {
  const sports = await ctx.orm.sport.findAll();
  try {
    const sport = await ctx.orm.sport.findOne({where: {name: ctx.request.body.sportname}})
    const team = await ctx.orm.team.create({
      name: ctx.request.body.name,
      sportId: sport.id,
    });
    ctx.redirect(ctx.router.url('team', { id: team.id }));
  } catch (validationError) {
    // console.log(ctx.request.body.sportname);
    await ctx.render('/teams/new', {
      sports,
      team: ctx.orm.team.build(ctx.request.body),
      errors: validationError.errors,
      createTeamUrl: ctx.router.url('createTeam'),
      indexUrl: ctx.router.url('teams'),
    });
  }
});

router.post('addMember', '/:id', async (ctx) => {
  const user = await ctx.orm.users.findOne({where: {username: ctx.request.body.name}});
  const team = await ctx.orm.team.findById(ctx.params.id, {
    include: [{
      model: ctx.orm.userTeam,
      include: ctx.orm.users,
    }],
  });
  const members = team.userTeams;
  if (user){
    // Si es que existe el usuario
    try {
      // Intentamos crear la tupla en la tabla de userTeam
      await ctx.orm.userTeam.create({teamId: team.id, userId: user.id});
      ctx.redirect(ctx.router.url('team', { id: team.id }));
    } catch (validationError) {
      // En caso de que el par usuario-equipo ya exista (se intentó agregar nuevamente un miembro)
      await ctx.render('teams/show', {
        errors: validationError.errors,
        team,
        members,
        editTeamUrl: ctx.router.url('editTeam', team.id),
        deleteTeamUrl: ctx.router.url('deleteTeam', team.id),
        indexUrl: ctx.router.url('teams'),
        addMemberUrl: ctx.router.url('addMember', team.id),
      });
    }
  }
  else{
    // En caso de que no exista el usuario ingresado
    ctx.redirect(ctx.router.url('team', { id: team.id }));
  }
});

router.get('editTeam', '/:id/edit', async (ctx) => {
  const team = await ctx.orm.team.findById(ctx.params.id);
  await ctx.render('teams/edit', {
    team,
    updateTeamUrl: ctx.router.url('updateTeam', team.id),
    showTeamUrl: ctx.router.url('team', team.id),
  });
});

router.patch('updateTeam', '/:id', async (ctx) => {
  const team = await ctx.orm.team.findById(ctx.params.id);
  try {
    await team.update(ctx.request.body);
    ctx.redirect(ctx.router.url('team', { id: team.id }));
  } catch (validationError) {
    await ctx.render('teams/edit', {
      team,
      errors: validationError.errors,
      updateTeamUrl: ctx.router.url('updateTeam', { id: team.id }),
      showTeamUrl: ctx.router.url('team', team.id),
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
  await ctx.render('teams/show', {
    team,
    members,
    editTeamUrl: ctx.router.url('editTeam', team.id),
    deleteTeamUrl: ctx.router.url('deleteTeam', team.id),
    indexUrl: ctx.router.url('teams'),
    addMemberUrl: ctx.router.url('addMember', team.id),
  });
});

module.exports = router;
