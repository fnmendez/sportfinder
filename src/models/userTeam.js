module.exports = function definesports(sequelize, DataTypes) {
  const userTeam = sequelize.define('userTeam', {});
  userTeam.associate = function associate(models) {};
  return userTeam;
};
