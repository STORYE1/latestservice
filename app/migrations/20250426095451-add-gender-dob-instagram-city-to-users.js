'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.addColumn('users', 'gender', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('users', 'dob', {
        type: Sequelize.DATE,
        allowNull: true,
      }),
      queryInterface.addColumn('users', 'instagram', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('users', 'city', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.removeColumn('users', 'gender'),
      queryInterface.removeColumn('users', 'dob'),
      queryInterface.removeColumn('users', 'instagram'),
      queryInterface.removeColumn('users', 'city'),
    ]);
  }
};
