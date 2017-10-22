module.exports = function defineteam(sequelize, DataTypes) {
  const team = sequelize.define('team', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Has ingresado un nombre vacío' },
      },
    },
  })
  team.prototype.getCaptainId = function getCaptainId() {
    // Instances refered with this might have userTeam loaded
  }
  team.associate = function associate(models) {
    team.hasMany(models.userTeam)
    team.belongsTo(models.sport)
  }
  return team
}
