const { DataTypes } = require("sequelize")
const sequelize = require("../utils/database");
const Cart = require("./cart");
const Product = require("./product");


const CartItem = sequelize.define("Cart_Item", {
    quantity: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    unit_price: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: false
    }
})

// Product.belongsToMany(Cart, {
//     through: CartItem,
//     constraints: true,
//     onDelete: 'RESTRICT',
//     onUpdate: 'CASCADE'
// })

// Cart.hasMany(Product, {
//     through: CartItem,
//     constraints: true,
//     constraints: true,
//     onDelete: 'RESTRICT',
//     onUpdate: 'CASCADE'
// })

module.exports = CartItem;