const { Sequelize } = require('sequelize');
const config = require('config');

const sequelize = new Sequelize(
    'lego_schema',
    'root',
    process.env.dbPass,
    {
        logging: process.env.NODE_ENV == "development" ? true : false,
        dialect: 'mysql',
        host: 'localhost'
    }
);

module.exports = sequelize;

