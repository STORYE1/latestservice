const config = require("../config/dbConfig");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        dialect: config.dialect,
        port: config.port,
    }
);

const db = {};

// Import models
db.User = require("./user")(sequelize, Sequelize.DataTypes);
db.Consumer = require("./consumer")(sequelize, Sequelize.DataTypes);
db.Tour = require("./guideModel")(sequelize, Sequelize.DataTypes);
db.Media = require("./mediaModel")(sequelize, Sequelize.DataTypes);
db.Category = require("./category")(sequelize, Sequelize.DataTypes);
db.ConsumerOTP = require("./consumerOTP")(sequelize, Sequelize.DataTypes);
db.GuideOTP = require("./guideOTP")(sequelize, Sequelize.DataTypes);
db.City = require("./city")(sequelize, Sequelize.DataTypes);

// Define associations

// User and Tour relationship
db.User.hasMany(db.Tour, {
    foreignKey: "user_id",
    as: "tours",
});
db.Tour.belongsTo(db.User, {
    foreignKey: "user_id",
    as: "user",
});

// Tour and Media relationship
db.Tour.hasMany(db.Media, {
    foreignKey: "tour_id",
    as: "media",
});
db.Media.belongsTo(db.Tour, {
    foreignKey: "tour_id",
    as: "tour",
});

// Category and Tour relationship
db.Category.hasMany(db.Tour, {
    foreignKey: "category_id",
    as: "tours",
});
db.Tour.belongsTo(db.Category, {
    foreignKey: "category_id",
    as: "category",
});

db.City.hasMany(db.Tour, {
    foreignKey: "city_id",
    as: "tours",
});
db.Tour.belongsTo(db.City, {
    foreignKey: "city_id",
    as: "city",
});

// No relationships for ConsumerOTP and GuideOTP
// These tables are independent and will be managed separately.

// Sequelize and Sequelize instance
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
