require('dotenv').config({ path: './src/environment_variables.env' });
// const config = require('config');
const express = require('express');
const helmet = require('helmet')
const cors = require('cors')
const debug = require('debug')('app:startup');
const app = express();
const sequelize = require('../utils/database');

const auth = require('../routes/auth');
const courses = require('../routes/courses')
const users = require('../routes/user');
const products = require('../routes/product');

app.use(express.json())

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(helmet());
app.use(cors());

app.use('/api/courses', courses);
app.use('/api/users/', users)
app.use('/api/auth/', auth)
app.use('/api/products/', products)


const port = process.env.PORT || 3000
sequelize.sync({})
    .then(result => {
        app.listen(port, () => {
            debug(`listening on port ${port}...`);
        })
    }
    ).catch(err => {
        debug('Error starting the server:', err);
    });







