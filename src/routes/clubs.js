const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('clubs', '/', async (ctx) => {
  const clubs = await ctx.orm.club.findAll();
  await ctx.render('clubs/index', {
    clubs,
    clubPath: club => ctx.router.url('club', {id: club.id}),
  });
});

router.get('newClub', '/new', async (ctx) => {
  const club = ctx.orm.club.build();
  await ctx.render('/clubs/new', {
    club,
    createPurposalPath: ctx.router.url('createClubPath'),
  });
});

router.post('createClubPath', '/', async (ctx) => {
  try {
  const club = await ctx.orm.club.create(ctx.request.body);
  ctx.redirect(ctx.router.url('club', {id: club.id}));
} catch (validationError){
  await ctx.render('/clubs/new', {
    club: ctx.orm.club.build(ctx.request.body),
    errors: validationError.errors,
    createPurposalPath: ctx.router.url('createClubpath'),
  });
}
});


router.get('club', '/:id', async (ctx) => {
  const club = await ctx.orm.club.findById(ctx.params.id, {
    include: [{
      model: ctx.orm.club_sport,
      include: ctx.orm.sport,
    }]
  });
  const relatedSports = club.club_sports;
  await ctx.render('clubs/show', {
    club,
    relatedSports,
  });
});


module.exports = router;
