const KoaRouter = require('koa-router');
// const matchesRouter = require('./matches')

const pkg = require('../../package.json');

const router = new KoaRouter();

router.get('home', '/', async (ctx) => {
  if (ctx.session.user) { ctx.redirect('profile'); }
  await ctx.render('welcome/home', {
    appVersion: pkg.version,
    signupUrl: ctx.router.url('signup'),
  });
});

router.post('login', 'login', async (ctx) => {
  const username = ctx.request.body.fields.username;
  const password = ctx.request.body.fields.password;
  const user = await ctx.orm.users.findOne({ where: {
    username, password,
  } });
  if (user) {
    ctx.session.user = { id: user.id };
    ctx.redirect('profile');
  } else {
    ctx.redirect('/');
  }
});

router.get('signup', 'signup', async (ctx) => {
  if (ctx.session.user) { ctx.redirect('profile'); }
  const user = ctx.orm.users.build();
  await ctx.render('welcome/signup', {
    homeUrl: '/',
    user,
  });
});

router.post('createUser', 'signup', async (ctx) => {
  try {
    const user = await ctx.orm.users.create(ctx.request.body);
    ctx.session.user = { id: user.id };
    ctx.redirect('profile');
  } catch (validationError) {
    await ctx.render('welcome/signup', {
      homeUrl: '/',
      user: ctx.orm.users.build(ctx.request.body),
      errors: validationError.errors,
    });
  }
});

router.del('deleteUser', 'profile', async (ctx) => {
  if (ctx.session.user) {
    const user = await ctx.orm.users.findById(ctx.session.user.id);
    await user.destroy();
    ctx.session = null;
  }
  await ctx.redirect('/');
});

router.patch('updateUser', 'profile', async (ctx) => {
  const user = await ctx.orm.users.findById(ctx.session.user.id);
  try {
    await user.update(ctx.request.body);
    ctx.redirect('profile');
  } catch (validationError) {
    await ctx.render('welcome/profile', {
      user,
      errors: validationError.errors,
      updateUrl: ctx.router.url('updateUser'),
      logoutUrl: ctx.router.url('logout'),
      startUrl: '/play',
      deleteUrl: ctx.router.url('deleteUser'),
    });
  }
});

router.get('showUser', 'profile', async (ctx) => {
  const user = await ctx.orm.users.findById(ctx.session.user.id);
  if (user) {
    await ctx.render('welcome/profile', {
      user,
      updateUrl: ctx.router.url('updateUser'),
      logoutUrl: ctx.router.url('logout'),
      startUrl: '/play',
      deleteUrl: ctx.router.url('deleteUser'),
    });
  } else {
    ctx.redirect('/');
  }
});

router.post('logout', 'logout', async (ctx) => {
  ctx.session = null;
  ctx.redirect('/');
});

module.exports = router;
