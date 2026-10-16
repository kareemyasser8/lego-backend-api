const { Sequelize } = require('sequelize');
const mysql2 = require('mysql2');

const environment = process.env.NODE_ENV;
let sequelize;

if (environment === "development") {
    sequelize = new Sequelize(
        process.env.dbNameDev,
        process.env.dbUserDev,
        process.env.dbPassDev,
        {
            dialect: 'mysql',
            dialectModule: mysql2,
            host: process.env.dbHostDev || 'localhost',
            port: process.env.dbPORTDev
        }
    );
} else {
    sequelize = new Sequelize(
        process.env.dbName,
        process.env.dbUser,
        process.env.dbPass,
        {
            dialect: 'mysql',
            dialectModule: mysql2,
            host: process.env.dbHost,
            port: process.env.dbPORT,
            dialectOptions: {
                ssl: { rejectUnauthorized: false }
            }
        }
    );
}

module.exports = sequelize;