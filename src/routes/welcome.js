const KoaRouter = require('koa-router');
const pkg = require('../../package.json');

const router = new KoaRouter();

router.get('home', '/', async (ctx) => {
  if (ctx.session.user) { ctx.redirect('profile') }
  await ctx.render('welcome/home', {
    user: ctx.session.user,
    appVersion: pkg.version,
    signupUrl: ctx.router.url('signup'),
  });
});

router.post('login', 'login', async (ctx) => {
  const username = ctx.request.body.fields.username;
  const password = ctx.request.body.fields.password;
  const user = await ctx.orm.users.findOne({ where: {
    username, password
  }});
  if (user) {
    ctx.session.user = user;
    ctx.redirect('profile');
  }
  else {
    ctx.redirect('/');
  }
});

router.get('signup', 'signup', async (ctx) => {
  if (ctx.session.user) { ctx.redirect('profile') }
  const user = ctx.orm.users.build();
  await ctx.render('welcome/signup', {
    homeUrl: '/',
    user,
    createUserPath: ctx.router.url('createUser'),
  });
});

router.post('createUser', 'signup', async (ctx) => {
  try {
    const user = await ctx.orm.users.create(ctx.request.body);
    ctx.session.user = user;
    ctx.redirect('profile');
  } catch (validationError) {
    await ctx.render('welcome/signup', {
      homeUrl: '/',
      user: ctx.orm.users.build(ctx.request.body),
      errors: validationError.errors,
      createUserPath: ctx.router.url('createUser'),
    });
  }
});

router.get('profile', 'profile', async (ctx) => {
  const user = ctx.session.user;
  if (user) {
    await ctx.render('welcome/profile', {
      user,
      updateUrl: "/",
      logoutUrl: ctx.router.url('logout'),
      startUrl: "/",
    });
  }
  else {
    ctx.redirect('/');
  }
});

router.post('logout', 'logout', async (ctx) => {
  ctx.session = null;
  ctx.redirect('/');
});

module.exports = router;
