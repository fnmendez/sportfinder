module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('clubSports', 'price',
      {
        type: Sequelize.INTEGER,
      })
  },

  down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('clubSports', 'price')
  },
}
