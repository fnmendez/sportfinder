module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.removeColumn('matches', 'sportId')
  },

  down(queryInterface, Sequelize) {
    return queryInterface.addColumn('matches', 'sportId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'sports',
          key: 'id',
        },
        onDelete: 'cascade',
      })
  },
}
