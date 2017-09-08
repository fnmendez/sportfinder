module.exports = function defineusers(sequelize, DataTypes) {
  const users = sequelize.define('users', {
    pid: {
      type: DataTypes.STRING,
      validate: {
        is: ["^\d{1,2}(\.\d{3}){2}\-([\dkK])$", "i"],
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate {
        unique: true,
        isAlphanumeric: true,
      }
    }
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 1,
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
