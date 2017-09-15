module.exports = function definematch(sequelize, DataTypes) {
  const match = sequelize.define('match', {
    date: DataTypes.DATE,
  });
  match.associate = function associate(models) {
    match.belongsTo(models.club);
    match.belongsTo(models.sport);
  };
  return match;
};
