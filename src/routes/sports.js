const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('sports', '/', async (ctx) => {
  const sports = await ctx.orm.sport.findAll();
  await ctx.render('sports/index', {
    sports,
    sportPath: sport => ctx.router.url('sport', { id: sport.id }),
    newPath: ctx.router.url('newSport'),
  });
});

router.del('deleteSport', '/:id', async (ctx) => {
  const sport = await ctx.orm.sport.findById(ctx.params.id);
  const sports = await ctx.orm.sport.findAll();
  await sport.destroy();

  await ctx.redirect(ctx.router.url('sports', {
    sports,
    sportPath: sport => ctx.router.url('sport', sport.id),
    newPath: ctx.router.url('newSport'),
  }));
});

router.get('newSport', '/new', async (ctx) => {
  const sport = ctx.orm.sport.build();
  await ctx.render('/sports/new', {
    sport,
    createSportPath: ctx.router.url('createSportPath'),
  });
});

router.post('createSportPath', '/', async (ctx) => {
  try {
    const sport = await ctx.orm.sport.create(ctx.request.body);
    ctx.redirect(ctx.router.url('sport', { id: sport.id }));
  } catch (validationError) {
    await ctx.render('/sports/new', {
      sport: ctx.orm.sport.build(ctx.request.body),
      errors: validationError.errors,
      createSportPath: ctx.router.url('createSportPath'),
    });
  }
});

router.get('sportEdit', '/:id/edit', async (ctx) => {
  const sport = await ctx.orm.sport.findById(ctx.params.id);
  await ctx.render('sports/edit', {
    sport,
    updateSportPath: ctx.router.url('sportUpdate', sport.id),
  });
});

router.patch('sportUpdate', '/:id', async (ctx) => {
  const sport = await ctx.orm.sport.findById(ctx.params.id);
  try {
    await sport.update(ctx.request.body);
    ctx.redirect(ctx.router.url('sport', { id: sport.id }));
  } catch (validationError) {
    await ctx.render('sports/edit', {
      sport,
      errors: validationError.errors,
      updateSportPath: ctx.router.url('sportUpdate', { id: sport.id }),
    });
  }
});


router.get('sport', '/:id', async (ctx) => {
  const sport = await ctx.orm.sport.findById(ctx.params.id);
  await ctx.render('sports/show', {
    sport,
    editSportPath: s => ctx.router.url('sportEdit', { id: s.id }),
    deleteSportPath: ctx.router.url('deleteSport', sport.id),
  });
});

module.exports = router;
