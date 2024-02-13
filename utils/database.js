const { Sequelize } = require('sequelize');
const config = require('config');
const mysql2 = require('mysql2')

const sequelize = new Sequelize(
    process.env.dbName,
    process.env.dbUser,
    process.env.dbPass,
    {
        // logging: process.env.NODE_ENV == "development" ? true : false,
        dialect: 'mysql',
        dialectModule: mysql2,
        host: 'mysql-306e5a9d-lego-clone-api.a.aivencloud.com',
        port: process.env.dbPORT
    }
);

module.exports = sequelize;
