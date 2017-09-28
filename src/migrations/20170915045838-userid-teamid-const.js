module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addConstraint('userTeams', ['userId', 'teamId'], {
      type: 'unique',
      name: 'memberConstraint',
    })
  },

  down(queryInterface, Sequelize) {
    return queryInterface.removeConstraint('userTeams', 'memberConstraint');
  },
}
