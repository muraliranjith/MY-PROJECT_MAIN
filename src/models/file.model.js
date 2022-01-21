const file = (sequelize, DataTypes) => {
    const File = sequelize.define(
        'file',
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            fileName: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            fileType: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            size: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            scanStatus: {
                type: DataTypes.BOOLEAN,
                default: true
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            Values: {
                type: DataTypes.JSON
            },
            decode:{
                type: DataTypes.JSON,
            }
        },
        {
            timestamps: true,
        }
    );
    return File;
};

module.exports = file;
