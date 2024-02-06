const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const WishList = sequelize.define('WishList',{
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
})

module.exports = WishList;