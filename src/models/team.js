module.exports = function defineteam(sequelize, DataTypes) {
  const team = sequelize.define('team', {
    name: DataTypes.STRING,
  });
  team.associate = function associate(models) {
    team.hasMany(models.userTeam);
  };
  return team;
};
