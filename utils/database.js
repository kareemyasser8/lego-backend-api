const { Sequelize } = require('sequelize');
const config = require('config');
const mysql2 = require('mysql2')

const environment = process.env.NODE_ENV;
let sequelize;

if (environment === "development") {
    sequelize = new Sequelize(
        process.env.dbNameDev,
        process.env.dbUserDev,
        process.env.dbPassDev,
        {
            // logging: process.env.NODE_ENV === "development" ? true : false,
            dialect: 'mysql',
            dialectModule: mysql2,
            host: 'localhost',
            port: process.env.dbPORTDev
        }
    );
} else {
    sequelize = new Sequelize(
        process.env.dbName,
        process.env.dbUser,
        process.env.dbPass,
        {
            // logging: process.env.NODE_ENV === "development" ? true : false,
            dialect: 'mysql',
            dialectModule: mysql2,
            host: 'mysql-306e5a9d-lego-clone-api.a.aivencloud.com',
            port: process.env.dbPORT
        }
    );
}


module.exports = sequelize;
