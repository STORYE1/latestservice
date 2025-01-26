const { DataTypes } = require('sequelize');
const sequelize = require("../config/sequelizeConnection");

module.exports = (sequelize) => {
    const City = sequelize.define(
        "City",
        {
            city_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            value: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            }
        },
        {
            tableName: "cities",
            timestamps: false,
        }
    );

    return City;
};
