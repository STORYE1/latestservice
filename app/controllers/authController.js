const AuthService = require('../services/authService');

class AuthController {
    async signup(req, res) {
        const { email, phone, userType } = req.body;

        try {
            const result = await AuthService.signup(email, phone, userType);
            return res.status(200).json(result);
        } catch (error) {
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
}

module.exports = new AuthController();
