const { DataTypes } = require('sequelize');
const jwt = require('jsonwebtoken')

const sequelize = require('../utils/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    fname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

User.prototype.generateAuthToken = function () {
    const token = jwt.sign({
        id: this.id,
        isAdmin: this.isAdmin
        },
        process.env.jwtPrivateKey,
        { expiresIn: '1h' })
    return token
}


module.exports = User;