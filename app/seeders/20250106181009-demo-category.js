'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Seeding the categories table with the provided values
    await queryInterface.bulkInsert('categories', [
      { label: 'Food Tour/Walk', value: 'food' },
      { label: 'Heritage Tour/Walk', value: 'heritage' },
      { label: 'City Tour/Walk', value: 'city' },
      { label: 'Cultural Tour/Walk', value: 'cultural' },
      { label: 'Auroville Tour/Walk', value: 'auroville' }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // Undo the seed if necessary
    await queryInterface.bulkDelete('categories', null, {});
  }
};
