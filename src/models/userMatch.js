module.exports = function defineuserMatch(sequelize, DataTypes) {
  const userMatch = sequelize.define('userMatch', {
    admin: DataTypes.INTEGER,
  });
  userMatch.associate = function associate(models) {
    userMatch.belongsTo(models.users);
    userMatch.belongsTo(models.match);
  };
  return userMatch;
};
