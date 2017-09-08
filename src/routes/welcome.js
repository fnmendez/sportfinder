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
  const user = ctx.orm.users.build();
  await ctx.render('welcome/signup', {
    homeUrl: '/',
    user,
    createUserPath: ctx.router.url('createUser'),
  });
});

router.post('createUser', 'signup', async (ctx) => {
  console.log(Object.keys(ctx.request.body));
  try {
    const user = await ctx.orm.users.create(ctx.request.body);
    ctx.redirect(ctx.router.url('/'), { signupUrl: ctx.router.url('welcome.signup')});
  } catch (validationError) {
    await ctx.render('welcome/signup', {
      homeUrl: '/',
      user: ctx.orm.users.build(ctx.request.body),
      errors: validationError.errors,
      createUserPath: ctx.router.url('createUser'),
    });
  };
});

router.get('login', '/', (ctx) => {
  console.log(ctx.request.body);
  ctx.flashMessage.notice = 'Form successfully processed';
  ctx.redirect(router.url('/'));
});

module.exports = router;
