module.exports = function definesports(sequelize, DataTypes) {
  const sports = sequelize.define('sport', {
    name: DataTypes.STRING,
  });
  sports.associate = function associate(models) {
    sports.hasMany(models.club_sport);
  };
  return sports;
};
