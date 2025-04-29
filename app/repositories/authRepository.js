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
        console.log("Received in AuthRepository.createUser:");
        console.log("UserData:", userData);
        console.log("UserType:", userType);

        const Model = this.getModel(userType);
        const newUser = await Model.create(userData);

        console.log("New user created:", newUser);
        return newUser;
    }

    async updateUser(updatedData, userType) {
        const Model = this.getModel(userType);
        return await Model.update(updatedData, { where: { email: updatedData.email } });
    }

    async saveOtp(email, otp, otpExpirationTime, userType) {
        console.log("Saving OTP for:", email, otp, otpExpirationTime, userType);

        const OtpModel = this.getOtpModel(userType); 
        const existingOtp = await OtpModel.findOne({ where: { email } });

        if (existingOtp) {
            await OtpModel.update(
                { otp, otpExpirationTime },
                { where: { email } }
            );
            console.log("OTP updated for:", email);
        } else {
            await OtpModel.create({ email, otp, otpExpirationTime });
            console.log("OTP created for:", email);
        }
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
