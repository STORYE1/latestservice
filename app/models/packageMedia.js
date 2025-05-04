const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const PackageMedia = sequelize.define(
        "PackageMedia",
        {
            media_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            package_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "tourpackages",
                    key: "package_id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            media_url: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            tableName: "packagemedia",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );

    return PackageMedia;
};