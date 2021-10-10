const { DataTypes } = require("sequelize");
const sequelize = require('../db/sequelize');


const Token = sequelize.define("token", {
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
    token: {
        type: DataTypes.STRING,
        allowNull: false
    },
})


module.exports = Token;

