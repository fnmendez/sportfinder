module.exports = function definesports(sequelize, DataTypes) {
  const userTeam = sequelize.define('userTeam', {});
  userTeam.associate = function associate(models) {
    userTeam.belongsTo(models.users);
    userTeam.belongsTo(models.team);
  };
  return userTeam;
};
