const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Tour = sequelize.define(
        "Tour",
        {
            tour_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'user_id',
                },
            },
            tour_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            tour_title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            tour_description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            languages: {
                type: DataTypes.ARRAY(DataTypes.STRING),  // Store languages as a JSON array
                allowNull: true,
            },
            ticket_price: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            leader_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            leader_description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            tour_duration: {
                type: DataTypes.STRING,  // Can be a string (e.g., "2 Hours")
                allowNull: true,
            },
            tour_days: {
                type: DataTypes.JSONB,  // Store the days and times as a JSON object
                allowNull: true,
            },
            city_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'cities',  // Ensure the referenced model is correct
                    key: 'city_id',
                },
            },
            category_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'categories',
                    key: 'category_id',
                },
            },

            guide_phone: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            guide_email_id: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            meeting_point: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            tour_includes: {
                type: DataTypes.JSONB,
                allowNull: true,
            },
            tour_excludes: {
                type: DataTypes.JSONB,
                allowNull: true,
            },
            leader_profile_pic: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            cover_photo: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            timestamps: true,
            tableName: 'tours',
        }
    );

    return Tour;
};
