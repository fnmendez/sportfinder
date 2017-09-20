const KoaRouter = require('koa-router');
const router = new KoaRouter();

const checkLogin = async (ctx, next) => {
  if (ctx.session.user) {
    const user = await ctx.orm.users.findById(ctx.session.user.id);
    if (!user) {
      return ctx.render('welcome/loginError', {
        homeUrl: '/',
      });
    }
  }
  else {
    return ctx.render('welcome/loginError', {
      homeUrl: '/',
    });
  }
  await next();
}

module.exports = checkLogin;
