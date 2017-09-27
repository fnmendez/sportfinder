module.exports = function definesports(sequelize, DataTypes) {
  const clubSport = sequelize.define('clubSport', {})
  clubSport.associate = function associate(models) {
    clubSport.belongsTo(models.club)
    clubSport.belongsTo(models.sport)
  }
  return clubSport
}
