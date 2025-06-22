const { DataTypes } = require('sequelize');
const sequelize = require("../config/sequelizeConnection");

module.exports = (sequelize, DataTypes) => {
    const CallTracking = sequelize.define('CallTracking', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        tour_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        guide_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        consumer_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        consumer_phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        timestamp: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'call_tracking',
        timestamps: false,
    });

    CallTracking.associate = (models) => {
        CallTracking.belongsTo(models.User, { foreignKey: 'guide_id', as: 'guide' }); // guides
        CallTracking.belongsTo(models.Consumer, { foreignKey: 'consumer_id', as: 'consumer' }); // consumers
        CallTracking.belongsTo(models.Tour, { foreignKey: 'tour_id', as: 'tour' });
    };

    return CallTracking;
};