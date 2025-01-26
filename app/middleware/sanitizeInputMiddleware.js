const { validationResult } = require('express-validator');
const { failureResponse } = require('../utils/responseHandler');
const logger = require('../utils/logger');

function validateInputs(req, res, next) {
    logger.info(`request body in sanitizeInputMiddleware : ${JSON.stringify(req.body)}`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return failureResponse(res, 400, { errors: errors.array() });
    }
    next();
}

module.exports = validateInputs;