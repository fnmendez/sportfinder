const faker = require('faker');

module.exports = {
  up(queryInterface, Sequelize) {
    const teamsData = [];
    for (let i = 0; i < 3; i += 1) {
      teamsData.push({
        name: faker.name.findName(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return queryInterface.bulkInsert('teams', teamsData);
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('teams', null, {});
  },
};
