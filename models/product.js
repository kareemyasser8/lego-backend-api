const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const Image = require('./image');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0
    },
    rating: {
        type: DataTypes.SMALLINT,
        defaultValue: 0
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    numInStock: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
})

module.exports = Product;

