const sequelize = require('../utils/database');
const { DataTypes } = require('sequelize');

const TemporaryCart = sequelize.define("TemporaryCart",{
    id :{
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    }
})

module.exports = TemporaryCart;