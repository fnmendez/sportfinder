module.exports = function defineclub(sequelize, DataTypes) {
  const club = sequelize.define('club', {
    name:
    {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  })
  club.associate = function associate(models) {
    club.hasMany(models.clubSport)
    club.hasMany(models.match)
  }
  return club
}
