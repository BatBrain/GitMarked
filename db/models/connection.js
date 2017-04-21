'use strict';

/**
 * Sequelize DB connection
 */

const Sequelize = require('sequelize');
const env       = 'development';
const config    = require(__dirname + '/../config.json')[env];

// Load our connection based on config file
const sequelize = new Sequelize(config.database, config.username, config.password, config);

module.exports = sequelize;
