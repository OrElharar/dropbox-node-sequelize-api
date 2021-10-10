const { DataTypes } = require("sequelize");
const sequelize = require('../db/sequelize');
const File = sequelize.define("file", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            validation(value) {
                if (!(this.type === "pdf" || this.type === "doc" || this.type === "docx" || this.type === "jpg")) {
                    throw new Error(`Invalid type of file, ${value} is forbidden.`)
                }
            }
        }
    },
    originalName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    storageName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    bucket: {
        type: DataTypes.STRING,
        allowNull: false
    },
    region: {
        type: DataTypes.STRING,
        allowNull: false
    },
    key: {
        type: DataTypes.STRING,
        allowNull: false
    }
})



module.exports = File;

