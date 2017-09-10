const faker = require('faker');

module.exports = {
  up(queryInterface, Sequelize) {
    const sportsData = [];
    const sportsNames = ['Futbol', 'Basquetbol', 'Tenis',
                          'Natacion', 'Polo'];
    for (let i = 0; i < 5; i += 1)
    {
      sportsData.push({
        name: sportsNames[i],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return queryInterface.bulkInsert('sports', sportsData);
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('sports', null, {});
  },
};
