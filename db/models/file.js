'use strict';

const Sequelize = require('sequelize');
const db = require('./connection.js');
const Submitted_Assignment = require('./submitted_assignment.js');

const File = db.define('File', {
  file_path: Sequelize.STRING,
  comments: Sequelize.ARRAY(Sequelize.INTEGER)
});

File.belongsTo(Submitted_Assignment, { foreignKey: {name: 'sub_assign_id'} });

module.exports = File;