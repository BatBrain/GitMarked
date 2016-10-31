'use strict';

const Sequelize = require('sequelize');
const db = require('./connection.js');
const School = require('./school.js');

const Mentor = db.define('Mentor', {
  first_name: Sequelize.STRING,
  last_name: Sequelize.STRING,
  github_name: Sequelize.STRING
});

//   , {
//     classMethods: {
//       associate: function(models) {
//         // associations can be defined here
//         Mentor.belongsTo(models.School);
//         Mentor.hasMany(models.Submitted_Assignment);
//       }
//     }
//   });
//   return Mentor;
// };

Mentor.belongsTo(School, { foreignKey: {name: 'school_id'} });

module.exports = Mentor;