const { DataTypes } = require('sequelize');
const sequelize = require("../config/sequelizeConnection");

module.exports = (sequelize) => {
    const Category = sequelize.define(
        "Category",
        {
            category_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            label: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            value: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            }
        },
        {
            tableName: "categories",
            timestamps: false,
        }
    );

    return Category;
};
