const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('clubs', '/', async (ctx) => {
  const clubs = await ctx.orm.club.findAll();
  await ctx.render('clubs/index', {
    clubs,
    clubUrl: club => ctx.router.url('club', { id: club.id }),
    newClubUrl: ctx.router.url('newClub'),
    notice: ctx.flashMessage.notice,
  });
});

router.delete('deleteClub', '/:id', async (ctx) => {
  const club = await ctx.orm.club.findById(ctx.params.id);
  await club.destroy();
  ctx.flashMessage.notice = 'El club fue eliminado exitosamente.';
  await ctx.redirect(ctx.router.url('clubs'));
});

router.get('newClub', '/new', async (ctx) => {
  const sports = await ctx.orm.sport.findAll();
  const club = ctx.orm.club.build();
  await ctx.render('/clubs/new', {
    club,
    sports,
    createClubUrl: ctx.router.url('createClub'),
    indexUrl: ctx.router.url('clubs'),
  });
});

router.post('createClub', '/', async (ctx) => {
  try {
    const club = await ctx.orm.club.create(ctx.request.body);
    ctx.redirect(ctx.router.url('club', { id: club.id }));
  } catch (validationError) {
    await ctx.render('/clubs/new', {
      club: ctx.orm.club.build(ctx.request.body),
      errors: validationError.errors,
      createClubUrl: ctx.router.url('createClub'),
      indexUrl: ctx.router.url('clubs'),
    });
  }
});

router.post('addSport', '/:id', async (ctx) => {
  const sport = await ctx.orm.sport.findOne({ where: {name: ctx.request.body.sportname }});
  if (sport){
    try {
      await ctx.orm.clubSport.create({
        clubId: ctx.params.id,
        sportId: sport.id,
      });
      ctx.redirect(ctx.router.url('club', ctx.params.id))
    } catch (validationError) {
      console.log("[ERROR]");
    }
  } else{
    ctx.redirect(ctx.router.url('club', ctx.params.id))
  }
});

router.get('editClub', '/:id/edit', async (ctx) => {
  const club = await ctx.orm.club.findById(ctx.params.id);
  await ctx.render('clubs/edit', {
    club,
    updateClubUrl: ctx.router.url('updateClub', club.id),
    showClubUrl: ctx.router.url('club', club.id),
  });
});

router.patch('updateClub', '/:id', async (ctx) => {
  const club = await ctx.orm.club.findById(ctx.params.id);
  try {
    await club.update(ctx.request.body);
    ctx.flashMessage.notice = 'El club ha sido actualizado.';
    ctx.redirect(ctx.router.url('club', { id: club.id }));
  } catch (validationError) {
    await ctx.render('clubs/edit', {
      club,
      errors: validationError.errors,
      updateClubUrl: ctx.router.url('updateClub', { id: club.id }),
      showClubUrl: ctx.router.url('club', club.id),
    });
  }
});

router.get('club', '/:id', async (ctx) => {
  const club = await ctx.orm.club.findById(ctx.params.id, {
    include: [{
      model: ctx.orm.clubSport,
      include: ctx.orm.sport,
    }],
  });
  const clubSports = club.clubSports;
  await ctx.render('clubs/show', {
    club,
    clubSports,
    deleteClubUrl: ctx.router.url('deleteClub', club.id),
    indexUrl: ctx.router.url('clubs'),
    editClubUrl: ctx.router.url('editClub', club.id),
    notice: ctx.flashMessage.notice,
    addSportUrl: ctx.router.url('addSport', club.id)
  });
});

module.exports = router;
