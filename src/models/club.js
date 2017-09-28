module.exports = function defineclub(sequelize, DataTypes) {
  const club = sequelize.define('club', {
    name:
    {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {msg: 'Has ingresado un nombre vacío'},
      },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {msg: 'Has ingresado una dirección vacía'},
      },
    },
  })
  club.associate = function associate(models) {
    club.hasMany(models.clubSport)
    club.hasMany(models.match)
  }
  return club
}
