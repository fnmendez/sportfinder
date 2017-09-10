module.exports = function definesports(sequelize, DataTypes) {
  const club_sport = sequelize.define('club_sport', {});
  club_sport.associate = function associate(models) {};
  return club_sport;
};
