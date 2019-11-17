const lodash = require('lodash');
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);

module.exports = function(config) {
  const dbConfig = config.get('db');
  const sequelize = dbConfig.url ? new Sequelize(dbConfig.url, lodash.pick(dbConfig, ['dialect', 'logging']))
                                 : new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, lodash.pick(dbConfig, ['host', 'dialect', 'logging']));

  const db = {};
  const modelsDir = path.normalize(`${__dirname}/../models`);
  fs.readdirSync(modelsDir)
    .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
    .forEach(file => {
      const model = sequelize['import'](path.join(modelsDir, file));
      db[model.name] = model;
    });

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
    if (db[modelName].setConfig) {
      db[modelName].setConfig(config);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
  return db;
};
