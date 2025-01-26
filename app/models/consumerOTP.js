const { DataTypes } = require("sequelize");


module.exports = (sequelize) => {

    const ConsumerOtp = sequelize.define('ConsumerOtp', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        otp: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        otpExpirationTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.fn('NOW'),
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.fn('NOW'),
        },
    });

    return ConsumerOtp
};