const KoaRouter = require('koa-router');

const pkg = require('../../package.json');
const router = new KoaRouter();

router.get('home', '/', async (ctx) => {
  if (ctx.session.user) {
    const user = await ctx.orm.users.findById(ctx.session.user.id);
    if (user) {
      return ctx.redirect('play');
    }
  }
  ctx.session = null;
  return ctx.render('welcome/home', {
    appVersion: pkg.version,
    signupUrl: ctx.router.url('signup'),
    warning: ctx.flashMessage.warning,
  });
});

router.post('login', 'login', async (ctx) => {
  const username = ctx.request.body.fields.username;
  const password = ctx.request.body.fields.password;
  const user = await ctx.orm.users.findOne({ where: { username } });
  if (user) {
    const isPasswordCorrect = await user.checkPassword(password);
    if (isPasswordCorrect) {
      ctx.session.user = { id: user.id };
      return ctx.redirect('play');
    }
  }
  ctx.flashMessage.warning = 'Has ingresado datos incorrectos.';
  return ctx.redirect('/');
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
    ctx.flashMessage.notice = 'Tu perfil ha sido actualizado.';
    return ctx.redirect('profile');
  } catch (validationError) {
    return ctx.render('welcome/editProfile', {
      user,
      errors: validationError.errors,
      updateUrl: ctx.router.url('updateUser'),
      deleteUrl: ctx.router.url('deleteUser'),
      profileUrl: ctx.router.url('showUser'),
    });
  }
});

router.get('showUser', 'profile', async (ctx) => {
  const user = await ctx.orm.users.findById(ctx.session.user.id);
  if (user) {
    await ctx.render('welcome/profile', {
      user,
      editUrl: ctx.router.url('editUser'),
      logoutUrl: ctx.router.url('logout'),
      startUrl: '/play',
      notice: ctx.flashMessage.notice,
    });
  } else {
    ctx.session = null;
    ctx.redirect('/');
  }
});

router.get('editUser', 'profile/edit', async (ctx) => {
  const user = await ctx.orm.users.findById(ctx.session.user.id);
  if (user) {
    await ctx.render('welcome/editProfile', {
      user,
      updateUrl: ctx.router.url('updateUser'),
      deleteUrl: ctx.router.url('deleteUser'),
      profileUrl: ctx.router.url('showUser'),
    });
  } else {
    ctx.session = null;
    ctx.redirect('/');
  }
});

router.post('logout', 'logout', async (ctx) => {
  ctx.session = null;
  ctx.redirect('/');
});

module.exports = router;
