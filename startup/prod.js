const helmet = require('helmet')
const cors = require('cors')
const compression = require('compression');

const corsOptions = {
  origin: "*",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  optionsSuccessStatus: 200
};
  
module.exports = (app) => {
    app.use(cors(corsOptions));
    app.use(helmet());
    app.use(compression());
}
