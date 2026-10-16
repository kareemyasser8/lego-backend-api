const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');

// Comma-separated list, e.g. CORS_ORIGIN=https://app.example.com,https://admin.example.com
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (curl, Postman, server-to-server) that send no Origin header
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  optionsSuccessStatus: 200,
};

module.exports = (app) => {
  app.use(cors(corsOptions));
  app.use(helmet());
  app.use(compression());
};
