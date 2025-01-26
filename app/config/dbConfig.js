console.log("database host: ", process.env.DB_HOST);
console.log("database user: ", process.env.DB_USER);
console.log("database port: ", process.env.DB_PORT);

module.exports = {
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
};