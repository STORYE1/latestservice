'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('guide_otps', {
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // Ensures each email has only one OTP
      },
      otp: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      otpExpirationTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('guide_otps');
  },
};
