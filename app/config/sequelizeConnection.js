const Sequelize = require("sequelize");
const logger = require("../utils/logger");

const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    // dialectOptions: { // Additional options if needed
    //   ssl: true
    // },
});

sequelize
    .authenticate()
    .then(() => {
        logger.info(`Database connection has been established successfully.`);
    })
    .catch((err) => {
        logger.error(`Unable to connect to the database: ${err}`);
    });

module.exports = sequelize;