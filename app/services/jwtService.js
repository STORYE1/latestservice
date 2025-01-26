const jwt = require('jsonwebtoken');

class JwtService {
    constructor() {
        this.secretKey = process.env.JWT_SECRET;

        if (!this.secretKey) {
            throw new Error("JWT_SECRET environment variable is not set");
        }
    }

    generateToken(payload, expiresIn = '168h') {
        try {
            return jwt.sign(payload, this.secretKey, { expiresIn });
        } catch (error) {
            console.error("Error generating token:", error.message);
            throw new Error("Failed to generate token");
        }
    }



    verifyToken(token) {
        try {
            return jwt.verify(token, this.secretKey);
        } catch (error) {
            console.error("Error verifying token:", error.message);
            throw error;
        }
    }
}

module.exports = new JwtService();
