module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('sports', 'maxPlayers',
      {
        type: Sequelize.INTEGER,
        allowNull: {msg: 'Debes ingresar una cantidad de jugadores'},
      })
  },

  down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('sports', 'maxPlayers')
  },
}
