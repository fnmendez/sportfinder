module.exports = function defineusers(sequelize, DataTypes) {
  const users = sequelize.define('users', {
    pid: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate {
        unique: true,
      }
    }
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: true,
        notEmpty: true,
      }
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: true,
        notEmpty: true,
      }
    },
    mail: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },
    photoId: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  users.associate = function associate(models) {
    // associations can be defined here
  };
  return users;
};
