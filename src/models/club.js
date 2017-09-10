module.exports = function defineclub(sequelize, DataTypes) {
  const club = sequelize.define('club', {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
  });
  club.associate = function associate(models) {
    club.hasMany(models.club_sport);
  };
  return club;
};
