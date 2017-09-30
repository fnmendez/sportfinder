module.exports = function definesports(sequelize, DataTypes) {
  const clubSport = sequelize.define('clubSport', {
    price: {
      type: DataTypes.INTEGER,
    },
    timeUnit: {
      type: DataTypes.STRING,
    },
  })

  clubSport.associate = function associate(models) {
    clubSport.belongsTo(models.club)
    clubSport.belongsTo(models.sport)
  }
  return clubSport
}
