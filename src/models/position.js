module.exports = function defineposition(sequelize, DataTypes) {
  const position = sequelize.define('position', {
    name: DataTypes.STRING,
  })
  position.associate = function associate(models) {
    position.belongsTo(models.sport)
  }
  return position
}
