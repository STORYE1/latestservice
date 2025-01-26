const logger = require('../utils/logger');
const responseHandler = require('../utils/responseHandler');

const errorHandler = (err, req, res, next) => {
    logger.error(err.stack);
    responseHandler.failureResponse(res, 500, 'Internal server error');
};

module.exports = errorHandler;