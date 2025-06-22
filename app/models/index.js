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

db.User = require("./user")(sequelize, Sequelize.DataTypes);
db.Consumer = require("./consumer")(sequelize, Sequelize.DataTypes);
db.Tour = require("./guideModel")(sequelize, Sequelize.DataTypes);
db.Media = require("./mediaModel")(sequelize, Sequelize.DataTypes);
db.Category = require("./category")(sequelize, Sequelize.DataTypes);
db.ConsumerOTP = require("./consumerOTP")(sequelize, Sequelize.DataTypes);
db.GuideOTP = require("./guideOTP")(sequelize, Sequelize.DataTypes);
db.City = require("./city")(sequelize, Sequelize.DataTypes);
db.States = require("./states")(sequelize, Sequelize.DataTypes);
db.Package = require("./packages")(sequelize, Sequelize.DataTypes);
db.TourPackage = require("./tourPackage")(sequelize, Sequelize.DataTypes);
db.PackageMedia = require("./packageMedia")(sequelize, Sequelize.DataTypes);
db.CallTracking = require("./callTracking")(sequelize, Sequelize.DataTypes);

db.User.hasMany(db.Tour, {
    foreignKey: "user_id",
    as: "tours",
});
db.Tour.belongsTo(db.User, {
    foreignKey: "user_id",
    as: "user",
});

db.Tour.hasMany(db.Media, {
    foreignKey: "tour_id",
    as: "media",
});
db.Media.belongsTo(db.Tour, {
    foreignKey: "tour_id",
    as: "tour",
});

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

// TourPackage and Category relationship
db.Category.hasMany(db.TourPackage, {
    foreignKey: "package_category",
    as: "tourPackages",
});
db.TourPackage.belongsTo(db.Category, {
    foreignKey: "package_category",
    as: "category",
});

db.States.hasMany(db.TourPackage, {
    foreignKey: "package_state",
    as: "tourPackages",
});
db.TourPackage.belongsTo(db.States, {
    foreignKey: "package_state",
    as: "state",
});

db.Package.hasMany(db.TourPackage, {
    foreignKey: "package_category",
    as: "tourPackages",
});
db.TourPackage.belongsTo(db.Package, {
    foreignKey: "package_category",
    as: "package",
});

db.TourPackage.hasMany(db.PackageMedia, {
    foreignKey: "package_id",
    as: "media",
});
db.PackageMedia.belongsTo(db.TourPackage, {
    foreignKey: "package_id",
    as: "tourPackage",
});


db.CallTracking.belongsTo(db.User, {
    foreignKey: "guide_id",
    as: "guide",
});
db.CallTracking.belongsTo(db.Consumer, {
    foreignKey: "consumer_id",
    as: "consumer",
});

db.CallTracking.belongsTo(db.Tour, {
    foreignKey: "tour_id",
    as: "tour",
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
