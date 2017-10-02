module.exports = function defineposition(sequelize, DataTypes) {
  const position = sequelize.define('position', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    horizontalAlignment: {
      type: DataTypes.STRING,
    },
    verticalAlignment: {
      type: DataTypes.STRING,
    },
  })
  position.associate = function associate(models) {
    position.belongsTo(models.sport)
  }
  return position
}
