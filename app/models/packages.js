const {DataTypes} = require('sequelize');
const sequelize = require("../config/sequelizeConnection");

module.exports = (sequelize) => {
    const Package = sequelize.define(
        "Package",
        {
            package_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            package_name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
           
        },
        {
            tableName: "packages",
            timestamps: false,
        }
    );

    return Package;
}