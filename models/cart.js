const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const Cart = sequelize.define('Cart',{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }    
})

module.exports = Cart;