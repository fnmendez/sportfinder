const faker = require('faker');

module.exports = {
  up(queryInterface, Sequelize) {
    const clubsData = [];
    for (let i = 0; i < 2; i += 1)
    {
      clubsData.push({
        name: faker.company.companyName(),
        address: faker.address.streetAddress(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return queryInterface.bulkInsert('clubs', clubsData);
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('clubs', null, {});
  },
};
