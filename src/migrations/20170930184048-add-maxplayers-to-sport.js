module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('sports', 'maxPlayers',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
      })
  },

  down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('sports', 'maxPlayers')
  },
}
