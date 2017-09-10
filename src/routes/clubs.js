const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('clubs', '/', async (ctx) => {
  const clubs = await ctx.orm.club.findAll();
  await ctx.render('clubs/index', {
    clubs,
    clubPath: club => ctx.router.url('club', { id: club.id }),
    newPath: ctx.router.url('newClub'),
  });
});

router.del('deleteClub', '/:id', async (ctx) => {
  const club = await ctx.orm.club.findById(ctx.params.id);
  const clubs = await ctx.orm.club.findAll();
  await club.destroy();

  await ctx.redirect(ctx.router.url('clubs', {
    clubs,
    clubPath: c => ctx.router.url('club', c.id),
    newPath: ctx.router.url('newClub'),
  }));
});

router.get('newClub', '/new', async (ctx) => {
  const club = ctx.orm.club.build();
  await ctx.render('/clubs/new', {
    club,
    createClubPath: ctx.router.url('createClubPath'),
  });
});

router.post('createClubPath', '/', async (ctx) => {
  try {
    const club = await ctx.orm.club.create(ctx.request.body);
    ctx.redirect(ctx.router.url('club', { id: club.id }));
  } catch (validationError) {
    await ctx.render('/clubs/new', {
      club: ctx.orm.club.build(ctx.request.body),
      errors: validationError.errors,
      createClubPath: ctx.router.url('createClubPath'),
    });
  }
});

router.get('clubEdit', '/:id/edit', async (ctx) => {
  const club = await ctx.orm.club.findById(ctx.params.id);
  await ctx.render('clubs/edit', {
    club,
    updateClubPath: ctx.router.url('clubUpdate', club.id),
  });
});

router.patch('clubUpdate', '/:id', async (ctx) => {
  const club = await ctx.orm.club.findById(ctx.params.id);
  try {
    await club.update(ctx.request.body);
    ctx.redirect(ctx.router.url('club', { id: club.id }));
  } catch (validationError) {
    await ctx.render('clubs/edit', {
      club,
      errors: validationError.errors,
      updateClubPath: ctx.router.url('clubUpdate', { id: club.id }),
    });
  }
});

router.get('club', '/:id', async (ctx) => {
  const club = await ctx.orm.club.findById(ctx.params.id, {
    include: [{
      model: ctx.orm.club_sport,
      include: ctx.orm.sport,
    }],
  });
  const relatedSports = club.club_sports;
  await ctx.render('clubs/show', {
    club,
    relatedSports,
    deleteClubPath: ctx.router.url('deleteClub', club.id),
  });
});


module.exports = router;
