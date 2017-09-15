const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('matches', '/', async (ctx) => {
  const matches = await ctx.orm.match.findAll();
  await ctx.render('matches/index', {
    matches,
    matchUrl: match => ctx.router.url('match', { id: match.id }),
    newMatchUrl: ctx.router.url('newMatch'),
    profileUrl: '/profile',
  });
});

router.del('deleteMatch', '/:id', async (ctx) => {
  const match = await ctx.orm.match.findById(ctx.params.id);
  await match.destroy();
  await ctx.redirect(ctx.router.url('matches'));
});

router.get('newMatch', '/new', async (ctx) => {
  const match = ctx.orm.match.build();
  const sports = await ctx.orm.sport.findAll();
  const clubs = await ctx.orm.club.findAll();
  await ctx.render('/matches/new', {
    match,
    sports,
    clubs,
    createMatchUrl: ctx.router.url('createMatch'),
    indexUrl: ctx.router.url('matches'),
  })
})

router.post('createMatch', '/', async (ctx) => {
  try {
    const match = await ctx.orm.match.create(ctx.request.body);
    ctx.redirect(ctx.router.url('matches'));
  } catch (validationError) {
    const match = ctx.orm.match.build(ctx.request.body);
    const sports = await ctx.orm.sport.findAll();
    const clubs = await ctx.orm.club.findAll();
    await ctx.redirect('newMatch', {
      match,
      sports,
      clubs,
      errors: validationError.errors,
      createMatchUrl: ctx.router.url('createMatch'),
    });
  }
});

router.get('match', '/:id', async (ctx) => {
  const match = await ctx.orm.match.findById(ctx.params.id);
  await ctx.render('matches/show', {
    match,
    deleteMatchUrl: ctx.router.url('deleteMatch', match.id),
    indexUrl: ctx.router.url('matches'),
  });
});

module.exports = router;
