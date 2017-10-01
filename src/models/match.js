const parseDate = require('../routes/parseDate')

module.exports = function definematch(sequelize, DataTypes) {
  const match = sequelize.define('match', {
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isRealistic(value) {
          if
          (value.getTime() < (new Date(Date.now() + (5 * 3600 * 1000))).getTime()) {
            throw new Error('La fecha a lo menos en 5 horas más.')
          } else if
          (value.getTime() > (new Date(Date.now() + (365 * 24 * 3600 * 1000))).getTime()) {
            throw new Error('La fecha no puede exceder de un año')
          }
        },
      },
    },
  }, {
    getterMethods: {
      displayDate() {
        return parseDate(this.date)
      },
    },
  })
  match.prototype.playersCount = function playersCount() {
    return this.userMatches.length
  }
  match.prototype.maxPlayers = function maxPlayers() {
    return this.sport.maxPlayers
  }
  match.prototype.isFull = function isFull() {
    return this.userMatches.length === this.sport.maxPlayers
  }
  match.associate = function associate(models) {
    match.belongsTo(models.club)
    match.belongsTo(models.sport)
    match.hasMany(models.userMatch)
  }
  return match
}
