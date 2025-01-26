const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Consumer = sequelize.define(
        'Consumer',
        {
            consumer_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    is: /^[0-9]{10}$/,
                },
            },
            token: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            otp: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            tableName: 'consumers',
            timestamps: true,
        }
    );

    return Consumer;
};
