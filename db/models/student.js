'use strict';

const Sequelize = require('sequelize');
const db = require('./connection.js');
const School = require('./school.js');

const Student = db.define('Student', {
  first_name: Sequelize.STRING,
  last_name: Sequelize.STRING,
  github_name: Sequelize.STRING
});

/*, {
  classMethods: {
    associate: function(models) {
      // associations can be defined here
      Student.belongsTo(models.School);
      Student.hasMany(models.Submitted_Assignment);
    }
  }
});
*/

Student.belongsTo(School, { foreignKey: {name: 'school_id'} });

module.exports = Student;