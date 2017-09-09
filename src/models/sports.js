module.exports = function definesports(sequelize, DataTypes) {
  const sports = sequelize.define('sport', {
    name: DataTypes.STRING,
  });
  sports.associate = function associate(models) {
    // associations can be defined here
  };
  return sports;
};
