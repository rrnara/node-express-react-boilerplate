const fs = require('fs');
const express = require('express');
const config = require('config');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');
const httpStatus = require('http-status');
const mailgun = require('mailgun-js');
const globalCache = require('global-cache');
const responseError = require('./service/common/ResponseError');
const loggerSetup = require('./service/setup/logger');
const passportSetup = require('./service/setup/passport');
const dbSetup = require('./service/setup/sequelize');
const routingSetup = require('./service/setup/routing');

const environment = config.util.getEnv() || 'development';
const isDev = environment === 'development';

const app = express();

globalCache.set('config', config);

const corsConfig = config.get('cors');
if (corsConfig.allow) {
  const corsOptions = {
    origin: (origin, callback) => {
      const allow = isDev && !origin; // In development environment, allow undefined origin
      if (allow || corsConfig.whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    optionsSuccessStatus: 200,
  };
  app.use(cors(corsOptions));
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const logger = loggerSetup();
globalCache.set('logger', logger);

const morganFormat = environment !== 'production' ? 'dev' : 'combined';
app.use(
  morgan(morganFormat, {
    skip: (req, res) => res.statusCode < 400,
    stream: { write: function(message, encoding) { logger.error(message); } }
  })
);

app.use(
  morgan(morganFormat, {
    skip: (req, res) => res.statusCode >= 400,
    stream: { write: function(message, encoding) { logger.info(message); } }
  })
);

const mg = mailgun(config.get('mailgun'));
globalCache.set('mailgun', mg);

const db = dbSetup();
globalCache.set('database', db);

routingSetup(app);

app.use(passport.initialize());
passportSetup(passport);

app.use('/api', function(req, res, next) {
  throw new responseError('Not found', httpStatus.NOT_FOUND);
});

app.use(express.static('public'));

app.use(function(req, res, next) {
  res.sendFile('public/index.html', { root: __dirname });
});

app.use(function(err, req, res, next) {
  logger.error(`Failed '${req.url}'. ${err.stack}`);
  const resp = responseError.createOrReuse(err);
  resp.respond(res);
});

const port = config.get('app.port');
app.listen(port, (err) => {
  if (err) {
    throw err;
  }

  logger.info(`App listening on port ${port}, environment: ${environment}`);
});
