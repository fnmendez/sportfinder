module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addConstraint('clubSports', ['clubId', 'sportId'], {
      type: 'unique',
      name: 'clubSportConstraint',
    });
  },

  down(queryInterface, Sequelize) {
    return queryInterface.removeConstraint('clubSports', 'clubSportConstraint');
  },
};
