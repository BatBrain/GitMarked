'use strict';

const Sequelize = require('sequelize');
const db = require('./connection.js');

const School = db.define('School', {
  name: Sequelize.STRING,
  description: Sequelize.STRING
});

//   , {
//     classMethods: {
//       associate: function(models) {
//         // associations can be defined here
//         School.hasMany(models.Student);
//         School.hasMany(models.Mentor);
//         School.hasMany(models.Assignment);
//       }
//     }
//   });
//   return School;
// };

module.exports = School;