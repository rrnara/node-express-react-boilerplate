const { createLogger, format, transports } = require('winston');
const globalCache = require('global-cache');

function formatParams(info) {
  const { timestamp, level, message, ...args } = info;
  const ts = timestamp.slice(0, 19).replace('T', ' ');

  return `${ts} ${level}: ${message} ${Object.keys(args).length
    ? JSON.stringify(args, '', '')
    : ''}`;
}

// https://github.com/winstonjs/winston/issues/1135
const developmentFormat = format.combine(
  format.colorize(),
  format.timestamp(),
  format.align(),
  format.printf(formatParams)
);

const productionFormat = format.combine(
  format.timestamp(),
  format.align(),
  format.printf(formatParams)
);

module.exports = function() {
  // Update config as necessary, refer to https://github.com/winstonjs/winston#logging
  // { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
  const config = globalCache.get('config');
  const level = config.get('logLevel');
  if (config.util.getEnv() !== 'production'){
    return createLogger({
      level: level,
      format: developmentFormat,
      transports: [new transports.Console()]
    });
  } else {
    return createLogger({
      level: level,
      format: productionFormat,
      transports: [
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'combined.log' })
      ]
    });
  }
};
