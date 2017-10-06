const sendWelcomeEmail = require('../mailers/welcome');
const KoaRouter = require('koa-router')
const fileStorage = require('../services/file-storage')
const pkg = require('../../package.json')

const router = new KoaRouter()

router.get('home', '/', async (ctx) => {
  if (ctx.session.user) {
    const user = await ctx.orm.users.findById(ctx.session.user.id)
    if (user) {
      return ctx.redirect('play')
    }
  }
  ctx.session = null
  return ctx.render('welcome/home', {
    appVersion: pkg.version,
    signupUrl: ctx.router.url('signup'),
  })
})

router.post('login', 'login', async (ctx) => {
  const username = ctx.request.body.fields.username
  const password = ctx.request.body.fields.password
  const user = await ctx.orm.users.findOne({ where: { username } })
  if (user) {
    const isPasswordCorrect = await user.checkPassword(password)
    if (isPasswordCorrect) {
      ctx.session.user = { id: user.id }
      return ctx.redirect('play')
    }
  }
  ctx.flashMessage.warning = 'Has ingresado datos incorrectos.'
  return ctx.redirect('/')
})

router.get('signup', 'signup', async (ctx) => {
  if (ctx.session.user) { ctx.redirect('profile') }
  const user = ctx.orm.users.build()
  await ctx.render('welcome/signup', {
    homeUrl: '/',
    user,
  })
})

router.post('createUser', 'signup', async (ctx) => {
  const developmentMode = ctx.state.env === 'development'
  if (developmentMode) {
    ctx.request.body.confirmed = true
  } else {
    ctx.request.body.confirmed = false
  }
  const user = ctx.orm.users.build(ctx.request.body)
  try {
    await user.save({
      fields: ['username', 'password', 'name', 'surname', 'mail', 'pid', 'confirmed'],
    })
    ctx.session.user = { id: user.id }
    const key = 'h4rc0d3dK3y'
    const id = user.id
    if (!developmentMode) {
      sendWelcomeEmail(ctx, {
        user,
        confirmateAccountUrl: 'https://sportfinder-app.herokuapp.com/users/' + id + '/' + key,
      })
      ctx.flashMessage.notice = 'Revisa tu mail para confirmar tu cuenta.'
    }
    ctx.redirect('profile')
  } catch (validationError) {
    await ctx.render('welcome/signup', {
      homeUrl: '/',
      user: ctx.orm.users.build(ctx.request.body),
      errors: validationError.errors,
    })
  }
})

router.delete('deleteUser', 'profile', async (ctx) => {
  if (ctx.session.user) {
    const user = await ctx.orm.users.findById(ctx.session.user.id)
    await user.destroy()
    ctx.session = null
  }
  await ctx.redirect('/')
})

router.patch('updateUser', 'profile', async (ctx) => {
  console.log("Patching the user...");
  console.log(ctx.request.body);
  const user = await ctx.orm.users.findById(ctx.session.user.id)
  try {
    await user.update(ctx.request.body)
    ctx.flashMessage.notice = 'Tu perfil ha sido actualizado.'
    return ctx.redirect('profile')
  } catch (validationError) {
    return ctx.render('welcome/editProfile', {
      user,
      errors: validationError.errors,
      updateUrl: ctx.router.url('updateUser'),
      deleteUrl: ctx.router.url('deleteUser'),
      profileUrl: ctx.router.url('showUser'),
    })
  }
})

router.get('editUser', 'profile/edit', async (ctx) => {
  const user = await ctx.orm.users.findById(ctx.session.user.id)
  if (user) {
    ctx.state.currentUser = user
    await ctx.render('welcome/editProfile', {
      user,
      updateUrl: ctx.router.url('updateUser'),
      deleteUrl: ctx.router.url('deleteUser'),
      profileUrl: ctx.router.url('showUser'),
    })
  } else {
    ctx.session = null
    ctx.redirect('/')
  }
})

router.get('confirmateAccount', 'users/:id/:key', async (ctx) => {
  const user = await ctx.orm.users.findById(ctx.params.id)
  if (user && ctx.params.key === 'h4rc0d3dK3y') {
    console.log('usuario')
    console.log(user)
    await user.update({ confirmed: true })
    ctx.flashMessage.notice = '¡Estás listo para jugar!'
    return ctx.redirect(ctx.router.url('matches'))
  }
  return ctx.throw(403)
})

router.get('sendEmail', ':id/sendConfirmationEmail', async (ctx) => {
  const id = ctx.params.id
  const user = await ctx.orm.users.findById(ctx.params.id)
  if (!user) {
    ctx.session = null
    ctx.flashMessage.warning = 'No tienes los permisos.'
    return ctx.redirect('/')
  }
  const key = 'h4rc0d3dK3y'
  await sendWelcomeEmail(ctx, {
    user,
    confirmateAccountUrl: 'https://sportfinder-app.herokuapp.com/users/' + id + '/' + key,
  })
  ctx.flashMessage.notice = `Se ha enviado nuevamente el mail de confirmación a ${user.mail}.`
  return ctx.redirect(ctx.router.url('profile'))
})

router.get('showUser', 'profile', async (ctx) => {
  const user = await ctx.orm.users.findById(ctx.session.user.id)
  if (user) {
    ctx.state.currentUser = user
    await ctx.render('welcome/profile', {
      user,
      editUrl: ctx.router.url('editUser'),
      logoutUrl: ctx.router.url('logout'),
      startUrl: '/play',
      sendEmailUrl: ctx.router.url('sendEmail', {
        id: ctx.state.currentUser.id,
      }),
    })
  } else {
    ctx.session = null
    ctx.redirect('/')
  }
})

router.get('profile.file', '/file', (ctx) => {
  ctx.body = fileStorage.download(ctx.query.file);
  ctx.response.type = 'image/png';
});

router.get('logout', 'logout', async (ctx) => {
  ctx.session = null
  ctx.redirect('/')
})

module.exports = router
