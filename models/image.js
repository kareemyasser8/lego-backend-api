const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Image = sequelize.define('Image', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

module.exports = Image;

