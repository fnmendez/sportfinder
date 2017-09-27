module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.renameTable('club_sports', 'clubSports')
  },

  down(queryInterface, Sequelize) {
    return queryInterface.renameTable('clubSports', 'club_sports')
  },
}
