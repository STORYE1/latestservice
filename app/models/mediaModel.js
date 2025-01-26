const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelizeConnection");

module.exports = (sequelize) => {
    const Media = sequelize.define(
        "Media",
        {
            media_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            tour_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'tours',
                    key: 'tour_id',
                },
            },

            type: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: [['image', 'video', 'audio', 'document']],
                }
            },

            media_url: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            tableName: "media",
            timestamps: true,
        }
    );

    return Media;
};