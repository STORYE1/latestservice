const { User } = require("../models");

class UserRepository {
    async updateProfilePic(userId, profilePicUrl) {
        try {
            const user = await User.findByPk(userId);
            if (user) {
                user.leader_profile_pic = profilePicUrl;
                await user.save();
                return user;
            }
            throw new Error("User not found");
        } catch (error) {
            console.error("Error updating profile picture:", error);
            throw new Error("Error updating profile picture: " + error.message);
        }
    }
}

module.exports = new UserRepository();
