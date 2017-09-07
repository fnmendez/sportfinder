const KoaRouter = require('koa-router');
const pkg = require('../../package.json');

const router = new KoaRouter();

router.get('welcome.home', '/', async (ctx) => {
  await ctx.render('welcome/home', {
    appVersion: pkg.version,
    signupUrl: ctx.router.url('welcome.signup'),
  });
});

router.get('welcome.signup', 'signup', async (ctx) => {
  //const user = ctx.orm.user.build();
  console.log(ctx.router.url('welcome.home'));
  await ctx.render('welcome/signup', {
    welcomeUrl: () => ctx.router.url('welcome.home'),
  });
});

router.get('login', '/', (ctx) => {
  console.log(ctx.request.body);
  ctx.flashMessage.notice = 'Form successfully processed';
  ctx.redirect(router.url('/'));
});

module.exports = router;
