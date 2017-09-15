module.exports = function defineuserMatch(sequelize, DataTypes) {
  const userMatch = sequelize.define('userMatch', {
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  });
  userMatch.associate = function associate(models) {
    userMatch.belongsTo(models.users);
    userMatch.belongsTo(models.match);
  };
  return userMatch;
};
