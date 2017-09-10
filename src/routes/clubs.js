const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('clubs', '/', async (ctx) => {
  const clubs = await ctx.orm.club.findAll();
  await ctx.render('clubs/index', {
    clubs,
    clubPath: club => ctx.router.url('club', {id: club.id}),
  });
});

router.get('club', '/:id', async (ctx) => {
  const club = await ctx.orm.club.findById(ctx.params.id)
  const sports = await ctx.orm.club.findById(ctx.params.id, {
    include: [{
      model: ctx.orm.club_sport,
      include: ctx.orm.sport,
    }]
  });
  const relatedSports = sports.club_sports;
  await ctx.render('clubs/show', {
    club,
    relatedSports,
  });
});

module.exports = router;
