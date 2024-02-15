const helmet = require('helmet')
const cors = require('cors')
const compression = require('compression');

const corsOptions = {
  origin: ['http://localhost:5173', 'https://lego-project-pi.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  optionsSuccessStatus: 200
};
  
module.exports = (app) => {
    app.use(cors(corsOptions));
    app.use(helmet());
    app.use(compression());
}
