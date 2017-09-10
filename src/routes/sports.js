const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('sports', '/', async (ctx) => {
  const sports = await ctx.orm.sport.findAll();
  await ctx.render('sports/index', {
    sports,
    sportPath: sport => ctx.router.url('sport', {id: sport.id}),
    newPath: ctx.router.url('newSport'),
  });
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
  ctx.redirect(ctx.router.url('sport', {id: sport.id}));
} catch (validationError){
  console.log("Hola");
  await ctx.render('/sports/new', {
    sport: ctx.orm.sport.build(ctx.request.body),
    errors: validationError.errors,
    createSportPath: ctx.router.url('createSportPath'),
  });
}
});

router.get('sport', '/:id', async (ctx) => {
  const sport = await ctx.orm.sport.findById(ctx.params.id);
  await ctx.render('sports/show', {
    sport,
  });
});

module.exports = router;
