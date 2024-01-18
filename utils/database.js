const {Sequelize} = require('sequelize');
const config = require('config');

const sequelize = new Sequelize(
    'lego_schema',
    'root',
    process.env.dbPass,
    {
        dialect: 'mysql',
        host: 'localhost'
    }
);

module.exports = sequelize;