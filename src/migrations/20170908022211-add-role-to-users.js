module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('users', 'role', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('users', 'role');
  },
};
