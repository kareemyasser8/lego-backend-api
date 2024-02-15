const helmet = require('helmet')
const cors = require('cors')
const compression = require('compression');

const corsOptions = {
    origin: ['http://localhost:5173', 'https://lego-project-pi.vercel.app/'],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  };
  
module.exports = (app) => {
    app.use(cors(corsOptions));
    app.use(helmet());
    app.use(compression());
}
