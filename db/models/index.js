'use strict';

const fs        = require('fs');
const path      = require('path');
const Sequelize = require('sequelize');
const basename  = path.basename(module.filename);
const env       = process.env.NODE_ENV || 'development';
const config    = require(__dirname + '/../config.json')[env];
let sequelize;

if (config.use_env_constiable) {
  sequelize = new Sequelize(process.env[config.use_env_constiable]);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const db = fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file !== basename) && (file.slice(-3) === '.js');
  })
  .reduce((a, file) => {
    const model = sequelize['import'](path.join(__dirname, file));
    a[model.name] = model;
    return a;
  }, {});

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;