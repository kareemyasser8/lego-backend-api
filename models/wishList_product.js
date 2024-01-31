const sequelize = require("../utils/database");
const WishList = require("./wishlist");
const Product = require("./product");

const WishListProducts = sequelize.define("WishList_Product", {});

module.exports = WishListProducts;