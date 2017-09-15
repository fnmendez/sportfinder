module.exports = function definesports(sequelize, DataTypes) {
  const sports = sequelize.define('sport', {
    name:
    {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });
  sports.associate = function associate(models) {
    sports.hasMany(models.club_sport);
    sports.hasMany(models.match);
  };
  return sports;
};
