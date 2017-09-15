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
    sports.hasMany(models.clubSport);
    sports.hasMany(models.match);
    sports.hasMany(models.team);
  };
  return sports;
};
