const sequelize = require('../utils/database');
const { DataTypes } = require('sequelize');

const TemporaryCartItem = sequelize.define("TemporaryCartItem", {
  quantity: {
    type: DataTypes.TINYINT,
    allowNull: false,
  },
  unit_price: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: false
  }
});

module.exports = TemporaryCartItem;