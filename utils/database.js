const { Sequelize } = require('sequelize');
const config = require('config');

// const sequelize = new Sequelize(
//     'lego_schema',
//     'root',
//     process.env.dbPass,
//     {
//         logging: process.env.NODE_ENV == "development" ? true : false,
//         dialect: 'mysql',
//         host: 'localhost'
//     }
// );

// module.exports = sequelize;


const sequelize = new Sequelize(
    'defaultdb',
    'avnadmin',
    process.env.dbPass,
    {
        logging: process.env.NODE_ENV == "development" ? true : false,
        dialect: 'mysql',
        host: 'mysql-306e5a9d-lego-clone-api.a.aivencloud.com:17514'
    }
);

module.exports = sequelize;
