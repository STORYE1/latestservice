const winston = require('winston');
const path = require('path');

const { format } = winston;
const { combine, timestamp, printf } = format;

const logDirectory = path.join(__dirname, '../logs');

const logFormat = printf(info => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
});

const logger = winston.createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        logFormat
    ),
    transports: [
        new winston.transports.File({ filename: path.join(logDirectory, 'error.log'), level: 'error' }),
        new winston.transports.File({ filename: path.join(logDirectory, 'combined.log') })
    ],
    exitOnError: false 
});

module.exports = logger;