const jwtService = require("../services/jwtService");
const { failureResponse } = require("../utils/responseHandler");
const logger = require("../utils/logger");

class AuthenticationMiddleware {
    constructor() {
        this.jwtService = jwtService;
    }

    authenticate = async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                logger.error("Authorization header is missing or invalid");
                return failureResponse(res, 401, "Authorization header is missing or invalid");
            }

            const token = authHeader.split(" ")[1];
            logger.info(`Extracted token: ${token}`);

            const decodedToken = await this.jwtService.verifyToken(token);
            logger.info(`Decoded token: ${JSON.stringify(decodedToken)}`);

            req.user = { userId: decodedToken.userId }; 
            next();
        } catch (error) {
            logger.error(`Error verifying token: ${error.message}`);
            if (error.name === "JsonWebTokenError") {
                return failureResponse(res, 401, "Invalid token");
            } else if (error.name === "TokenExpiredError") {
                return failureResponse(res, 401, "Token has expired");
            }
            return failureResponse(res, 500, "An error occurred during authentication");
        }
    };


}

module.exports = new AuthenticationMiddleware();
