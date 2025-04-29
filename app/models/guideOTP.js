const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const GuideOtp = sequelize.define(
        'GuideOtp',
        {
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
        },
        {
            tableName: 'GuideOtps',
            timestamps: true,
        }
    );

    return GuideOtp;
};
