const logger = require('../utils/logger');

const successResponse = (res, status, message, data = {}) => {
    res.status(status).json({
        success: true,
        message,
        ...data 
    });
};

const failureResponse = (res, status, message) => {
    res.status(status).json({
        success: false,
        message
    });
};

module.exports = {
    successResponse,
    failureResponse
};
