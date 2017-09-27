module.exports = function defineteam(sequelize, DataTypes) {
  const team = sequelize.define('team', {
    name:
    {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  })
  team.associate = function associate(models) {
    team.hasMany(models.userTeam)
    team.belongsTo(models.sport)
  }
  return team
}
