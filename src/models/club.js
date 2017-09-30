module.exports = function defineclub(sequelize, DataTypes) {
  const club = sequelize.define('club', {
    name:
    {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Has ingresado un nombre vacío' },
      },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Has ingresado una dirección vacía' },
      },
    },
  })

  club.prototype.matchDisplay = function matchDisplay(sportid) {
    // Instances refered with this might have clubsports loaded
    var displayString = ""
    this.clubSports.forEach( (clubSport) => {
      if (clubSport.sportId === parseInt(sportid)) {
        displayString = `${clubSport.priceDisplay()} por cada ${clubSport.timeUnit}`
      }
    })
    return displayString
  }
  club.associate = function associate(models) {
    club.hasMany(models.clubSport)
    club.hasMany(models.match)
  }
  return club
}
