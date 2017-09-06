const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('sports', '/', async (ctx) => {
  console.log('Aquiiiiiiiii');
  console.log(Object.keys(ctx.orm));
  const sports = await ctx.orm.sport.findAll();
  await ctx.render('sports/index', {
    sports,
  });
});

module.exports = router;
