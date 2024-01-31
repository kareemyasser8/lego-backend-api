const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const WishList = sequelize.define('WishList',{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
})

module.exports = WishList;