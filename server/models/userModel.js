const { DataTypes } = require("sequelize");
const sequelize = require('../db/sequelize');
const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");
const File = require("./fileModel");
const Token = require("./tokenModel");

const User = sequelize.define("user", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        },
        unique: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/
        }
    }
}, {
    hooks: {
        beforeCreate: async (user) => {
            user.password = await bcrypt.hash(user.password, 8);
        }
    }
})


User.prototype.generateAuthToken = function () {
    const user = this;
    const token = jwt.sign({ _id: user.id.toString() }, process.env.JWT_SECRET_USER);
    console.log(token);
    return token
}
User.prototype.toJSON = function () {
    var values = Object.assign({}, this.get());

    delete values.password;
    return values;
}

User.findByCredentials = async (email, password) => {
    const user = await User.findOne({ limit: 1, where: { email } })
    if (user == null) {
        throw new Error("Unable to login.");
    }
    const hashedPassword = user.dataValues.password
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
        throw new Error("Unable to login.");
    }
    return user;
}

User.hasMany(File, {
    foreignKey: 'userId', sourceKey: 'id'
});

File.belongsTo(User);


User.hasMany(Token, {
    foreignKey: 'userId', sourceKey: 'id'
});
Token.belongsTo(User);

module.exports = User;

