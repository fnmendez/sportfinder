module.exports = function defineclub(sequelize, DataTypes) {
  const club = sequelize.define('club', {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
  });
  club.associate = function associate(models) {
    // associations can be defined here
  };
  return club;
};