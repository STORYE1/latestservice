'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
  
    await queryInterface.bulkInsert('categories', [
      { label: 'Food Tour/Walk', value: 'food' },
      { label: 'Heritage Tour/Walk', value: 'heritage' },
      { label: 'City Tour/Walk', value: 'city' },
      { label: 'Cultural Tour/Walk', value: 'cultural' },
      { label: 'Auroville Tour/Walk', value: 'auroville' }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
  
    await queryInterface.bulkDelete('categories', null, {});
  }
};
