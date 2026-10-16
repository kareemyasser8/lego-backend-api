require('dotenv').config({ path: './src/environment_variables.env' });
const express = require('express');
const debug = require('debug')('app:startup');
const app = express();
const sequelize = require('./utils/database');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use("/api/images", express.static('images'));
require('./startup/prod')(app);
require('./startup/routes')(app);

const port = process.env.PORT || 3000;

sequelize.sync({})
    .then(() => {
        // Only start a listener when running locally; Vercel handles this itself
        if (!process.env.VERCEL) {
            app.listen(port, () => {
                debug(`listening on port ${port}...`);
            });
        }
    })
    .catch(err => {
        debug('Error starting the server:', err);
    });

module.exports = app;