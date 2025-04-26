const AuthService = require('../services/authService');

class AuthController {
    async signup(req, res) {
        let { email, phone, userType, gender, dob, instagram, city } = req.body;

        console.log("Received from frontend:");
        console.log("Email:", email);
        console.log("Phone:", phone);
        console.log("UserType:", userType);
        console.log("Gender:", gender);
        console.log("DOB:", dob);
        console.log("Instagram:", instagram);
        console.log("City:", city);

        if (userType === "consumer") {
            instagram = undefined;
            city = undefined;
        }

        try {
            const result = await AuthService.signup(email, phone, userType, gender, dob, instagram, city);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error in AuthController.signup:", error.message);
            return res.status(400).json({ error: error.message });
        }
    }

    async verifySignupOtp(req, res) {
        const { email, otp, userType, phone } = req.body;
        console.log("this is data ", email, otp, userType, phone)

        try {
            const result = await AuthService.verifySignupOtp(email, otp, userType, phone);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async loginRequest(req, res) {
        const { email, userType } = req.body;

        try {
            const result = await AuthService.loginRequest(email, userType);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async loginVerify(req, res) {
        const { email, otp, userType } = req.body;

        try {
            const result = await AuthService.loginVerify(email, otp, userType);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async getUserFromToken(req, res) {
        const { token, userType } = req.body;

        try {
            const user = await AuthService.getUserFromToken(token, userType);
            return res.status(200).json(user);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await AuthService.getAllUsers();
            return res.status(200).json(users);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async updateVerificationStatus(req, res) {
        try {
            const { user_ids, is_verified } = req.body;

            if (!Array.isArray(user_ids) || user_ids.length === 0) {
                return res.status(400).json({ message: "Invalid user IDs" });
            }

            const updatedUsers = await AuthService.updateVerificationStatus(user_ids, is_verified);

            return res.status(200).json({
                message: "Verification status updated successfully",
                updatedUsers
            });
        } catch (error) {
            console.error("Error updating verification status:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async checkVerification(req, res) {
        try {
            const { user_id } = req.params;
            const isVerified = await AuthService.checkUserVerification(user_id);

            if (isVerified === null) {
                return res.status(404).json({ message: "User not found" });
            }

            res.json({ user_id, is_verified: isVerified });
        } catch (error) {
            console.error("Error checking user verification:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

}

module.exports = new AuthController();
