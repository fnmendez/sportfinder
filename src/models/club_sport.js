module.exports = function definesports(sequelize, DataTypes) {
  const club_sport = sequelize.define('club_sport', {});
  club_sport.associate = function associate(models) {
    club_sport.belongsTo(models.club);
    club_sport.belongsTo(models.sport);
  };
  return club_sport;
};
