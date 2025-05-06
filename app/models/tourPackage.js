const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const TourPackage = sequelize.define(
        "TourPackage",
        {
            package_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            package_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            package_title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            package_description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            languages: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                allowNull: true,
            },
            package_price: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            service_provider_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            service_provider_description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            package_duration: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            package_category: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "packages",
                    key: "package_id",
                },
            },
            service_provider_email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            service_provider_phone: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            package_includes: {
                type: DataTypes.JSONB,
                allowNull: true,
            },
            package_excludes: {
                type: DataTypes.JSONB,
                allowNull: true,
            },
            service_provider_pic: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            package_cover_photo: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            pickup: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            drop: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            package_state: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "states",
                    key: "state_id",
                },
            },

        },
        {
            tableName: "tourpackages",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );

    TourPackage.associate = (models) => {
        TourPackage.hasMany(models.PackageMedia, {
            foreignKey: "package_id",
            as: "media",
        });
    };

    return TourPackage;
};