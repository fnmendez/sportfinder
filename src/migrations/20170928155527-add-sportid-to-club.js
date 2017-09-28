module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('clubs', 'sportId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'sports',
          key: 'id',
        },
        onDelete: 'cascade',
      });
  },

  down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('clubs', 'sportId');
  },
};
