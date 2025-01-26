'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tours', {
      tour_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id',
        },
      },
      tour_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tour_title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tour_description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      languages: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      ticket_price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      leader_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      leader_description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      tour_duration: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      tour_days: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      city_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cities',
          key: 'city_id',
        },
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'category_id',
        },
      },
      guide_phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      guide_email_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      meeting_point: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      tour_includes: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      tour_excludes: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      leader_profile_pic: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cover_photo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tours');
  }
};
