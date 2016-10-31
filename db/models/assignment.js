'use strict';

const Sequelize = require('sequelize');
const db = require('./connection.js');
const School = require('./school.js');

const Assignment = db.define('Assignment', {
  name: Sequelize.STRING,
  description: Sequelize.STRING
});

//   , {
//     classMethods: {
//       associate: function(models) {
//         // associations can be defined here
//         Assignment.belongsTo(models.School);
//         Assignment.hasMany(models.Submitted_Assignment);
//       }
//     }
//   });
//   return Assignment;
// };

Assignment.belongsTo(School, { foreignKey: {name: 'school_id'} });

module.exports = Assignment;