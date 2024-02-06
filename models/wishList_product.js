const sequelize = require("../utils/database");

const WishListProducts = sequelize.define("WishList_Product", {});

module.exports = WishListProducts;