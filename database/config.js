const config = require('config');

const nodeEnv = config.util.getEnv() || 'development';
const dbConfig = Object.assign({}, config.get('db'));
delete dbConfig.logging;

module.exports = {
  [nodeEnv]: dbConfig
};
