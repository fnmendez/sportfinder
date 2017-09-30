module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('teams', 'sportId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'sports',
          key: 'id',
        },
        onDelete: 'set null',
      })
  },

  down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('teams', 'sportId')
  },
}
