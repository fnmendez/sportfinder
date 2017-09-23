const checkLogin = async (ctx, next) => {
  if (ctx.session.user) {
    const user = await ctx.orm.users.findById(ctx.session.user.id);
    if (!user) {
      return ctx.render('welcome/loginError', {
        homeUrl: '/',
      });
    }
    Object.assign(ctx.state, {
      currentUser: { id: user.id, username: user.username },
    });
  } else {
    return ctx.render('welcome/loginError', {
      homeUrl: '/',
    });
  }
  await next();
};

module.exports = checkLogin;
