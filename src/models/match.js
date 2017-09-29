const parseDate = require('../routes/parseDate')

module.exports = function definematch(sequelize, DataTypes) {
  const match = sequelize.define('match', {
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    getterMethods: {
      displayDate() {
        return parseDate(this.date)
      },
    },
  })
  match.prototype.howManyPlayers = async function howManyPlayers(ctx) {
    const query = await ctx.orm.userMatch.findOne({
      attributes: [[sequelize.fn('COUNT', sequelize.col('*')), 'amount']],
      where: { matchId: this.id },
    })
    return query.dataValues.amount
  }
  match.prototype.howManyAdmins = async function howManyAdmins(ctx) {
    const query = await ctx.orm.userMatch.findOne({
      attributes: [[sequelize.fn('COUNT', sequelize.col('*')), 'amount']],
      where: { matchId: this.id, admin: true },
    })
    return query.dataValues.amount
  }
  match.associate = function associate(models) {
    match.belongsTo(models.club)
    match.belongsTo(models.sport)
    match.hasMany(models.userMatch)
  }
  return match
}
