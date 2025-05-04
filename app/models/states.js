const { DataTypes } = require('sequelize');
const sequelize = require("../config/sequelizeConnection");

module.exports = (sequelize) => {
    const State = sequelize.define(
        "State",
        {
            state_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            state_name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
        },
        {
            tableName: "states",
            timestamps: false,
        }
    );

    return State;
}