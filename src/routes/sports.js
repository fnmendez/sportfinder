const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('sports', '/', async (ctx) => {
  const sports = await ctx.orm.sport.findAll();
  await ctx.render('sports/index', {
    sports,
    sportUrl: sport => ctx.router.url('sport', { id: sport.id }),
    newSportUrl: ctx.router.url('newSport'),
  });
});

router.del('deleteSport', '/:id', async (ctx) => {
  const sport = await ctx.orm.sport.findById(ctx.params.id);
  await sport.destroy();
  await ctx.redirect(ctx.router.url('sports'));
});

router.get('newSport', '/new', async (ctx) => {
  const sport = ctx.orm.sport.build();
  await ctx.render('/sports/new', {
    sport,
    createSportUrl: ctx.router.url('createSport'),
    indexUrl: ctx.router.url('sports'),
  });
});

router.post('createSport', '/', async (ctx) => {
  try {
    const sport = await ctx.orm.sport.create(ctx.request.body);
    ctx.redirect(ctx.router.url('sport', { id: sport.id }));
  } catch (validationError) {
    await ctx.render('/sports/new', {
      sport: ctx.orm.sport.build(ctx.request.body),
      errors: validationError.errors,
      createSportUrl: ctx.router.url('createSport'),
      indexUrl: ctx.router.url('sports'),
    });
  }
});

router.get('editSport', '/:id/edit', async (ctx) => {
  const sport = await ctx.orm.sport.findById(ctx.params.id);
  await ctx.render('sports/edit', {
    sport,
    updateSportUrl: ctx.router.url('updateSport', sport.id),
    showUrl: ctx.router.url('sport', sport.id),
  });
});

router.patch('updateSport', '/:id', async (ctx) => {
  const sport = await ctx.orm.sport.findById(ctx.params.id);
  try {
    await sport.update(ctx.request.body);
    ctx.redirect(ctx.router.url('sport', { id: sport.id }));
  } catch (validationError) {
    await ctx.render('sports/edit', {
      sport,
      errors: validationError.errors,
      updateSportUrl: ctx.router.url('updateSport', { id: sport.id }),
      showUrl: ctx.router.url('sport', sport.id),
    });
  }
});


router.get('sport', '/:id', async (ctx) => {
  const sport = await ctx.orm.sport.findById(ctx.params.id);
  await ctx.render('sports/show', {
    sport,
    editSportUrl: ctx.router.url('editSport', sport.id),
    deleteSportUrl: ctx.router.url('deleteSport', sport.id),
    indexUrl: ctx.router.url('sports'),
  });
});

module.exports = router;
