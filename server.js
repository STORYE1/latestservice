require('dotenv').config();
const app = require('./app');
const logger = require('./app/utils/logger');

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});
process.on('unhandledRejection', (err) => {
    logger.error('Unhandled promise rejection:', err);
    server.close(() => {
        process.exit(1);
    });
});