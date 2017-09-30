module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('matches', 'clubId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'clubs',
          key: 'id',
        },
        onDelete: 'set null',
      })
  },

  down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('matches', 'clubId')
  },
}
