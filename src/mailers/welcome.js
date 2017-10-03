module.exports = function sendWelcomeEmail(ctx, { user }) {
  console.log('Sending Mail')
  return ctx.sendMail('welcome', { to: user.mail, subject: 'Welcome to Sportfinder!' }, { user })
}
