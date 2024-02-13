const helmet = require('helmet')
const cors = require('cors')
const compression = require('compression');
// const morgan = require('morgan');
// const fs = require('fs');
// const path = require('path');

module.exports = (app) => {

    // const accessLogStream = fs.createWriteStream(
    //     path.join(__dirname, 'access.log'),
    //     { flags: 'a' }
    // )

    app.use(helmet());
    app.use(cors());
    app.use(compression());
    // app.use(morgan('combined', { stream: accessLogStream }));
}
