module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('clubSports', 'timeUnit',
      {
        type: Sequelize.STRING,
      })
  },

  down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('clubSports', 'timeUnit')
  },
}
