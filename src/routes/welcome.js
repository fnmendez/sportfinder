const KoaRouter = require('koa-router');
const pkg = require('../../package.json');

const router = new KoaRouter();

router.get('/', async (ctx) => {
  await ctx.render('welcome', { appVersion: pkg.version });
});

router.post('login', '/', (ctx) => {
  console.log(ctx.request.body);
  ctx.flashMessage.notice = 'Form successfully processed';
  ctx.redirect(router.url('/'));
});

module.exports = router;
