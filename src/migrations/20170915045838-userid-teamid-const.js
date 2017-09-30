module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addConstraint('userTeams', ['userId', 'teamId'], {
      type: 'unique',
      name: 'memberConstraint',
    })
  },

  down(queryInterface) {
    return queryInterface.removeConstraint('userTeams', 'memberConstraint')
  },
}
