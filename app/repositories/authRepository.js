const { User, Consumer, GuideOTP, ConsumerOTP } = require('../models');

class AuthRepository {
    getModel(userType) {
        if (userType === "guide") return User;
        if (userType === "consumer") return Consumer;
        throw new Error("Invalid userType");
    }

    getOtpModel(userType) {
        console.log("this is user type ", userType)
        if (userType === "guide") return GuideOTP;
        if (userType === "consumer") return ConsumerOTP;
        throw new Error("Invalid userType");
    }



    async findUserByEmail(email, userType) {
        const Model = this.getModel(userType);
        return await Model.findOne({ where: { email } });
    }


    async findUserByPhone(phone, userType) {
        const Model = this.getModel(userType);
        return await Model.findOne({ where: { phone } });
    }


    async createUser(userData, userType) {
        console.log("inside create user")
        const Model = this.getModel(userType);
        return await Model.create(userData);
    }

    async updateUser(updatedData, userType) {
        const Model = this.getModel(userType);
        return await Model.update(updatedData, { where: { email: updatedData.email } });
    }

    async saveOtp(email, otp, otpExpirationTime, userType) {
        console.log("GuideOTP Model:", GuideOTP);
        console.log("ConsumerOTP Model:", ConsumerOTP);

        console.log("these are the values in saveotp repo ", email, otp, otpExpirationTime, userType)
        const OtpModel = this.getOtpModel(userType);
        console.log("this is otp model ", OtpModel)
        const existingOtp = await OtpModel.findOne({ where: { email } });

        if (existingOtp) {
            return await OtpModel.update({ otp, otpExpirationTime }, { where: { email } });
        }

        return await OtpModel.create({ email, otp, otpExpirationTime });
    }

    async findOtpByEmail(email, userType) {
        const OtpModel = this.getOtpModel(userType);
        return await OtpModel.findOne({ where: { email } });
    }

    async findUserById(userId, userType) {
        const Model = this.getModel(userType);
        return await Model.findByPk(userId);
    }

    async findUserByEmailCheckStatus(email, userType) {
        const Model = this.getModel(userType);
        return await Model.findOne({ where: { email }, attributes: ['email', 'token'] });
    }

    async getAllUsers() {
        return await User.findAll({ attributes: ['user_id', 'email', 'phone', 'is_verified'] });
    }


    async updateVerificationStatus(userIds, isVerified) {
        const updatedUsers = await User.update(
            { is_verified: isVerified },
            { where: { user_id: userIds } }
        );

        return updatedUsers;
    }

    async findUserById(user_id) {
        return await User.findOne({ where: { user_id } });
    };
}

module.exports = AuthRepository;
