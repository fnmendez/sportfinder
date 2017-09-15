module.exports = function defineusers(sequelize, DataTypes) {
  const users = sequelize.define('users', {
    pid: {
      type: DataTypes.STRING,
      // validate: {
      //   is: ["^\d{1,2}(\.\d{3}){2}\-([\dkK])$", "i"],
      // }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isAlphanumeric: true,
      },
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: true,
        notEmpty: true,
      },
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: true,
        notEmpty: true,
      },
    },
    mail: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
    users.hasMany(models.userTeam);
    users.hasMany(models.userMatch);
  };
  return users;
};
