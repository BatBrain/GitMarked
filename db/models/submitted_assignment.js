'use strict';

const Sequelize = require('sequelize');
const db = require('./connection.js');
const Assignment = require('./assignment.js');
const Student = require('./student.js');
const Mentor = require('./mentor.js');

const Submitted_Assignment = db.define('Submitted_Assignment', {
  assignment_url: Sequelize.STRING,
  status: Sequelize.STRING
});

//   , {
//     classMethods: {
//       associate: function(models) {
//         // associations can be defined here
//         Submitted_Assignment.belongsTo(models.Assignment);
//         Submitted_Assignment.belongsTo(models.Student);
//         Submitted_Assignment.belongsTo(models.Mentor);
//         Submitted_Assignment.hasMany(models.Comment);
//       }
//     }
//   });
//   return Submitted_Assignment;
// };

// , { as: 'assignment_id' }
// , { foreignKey: {name 'assignment_id'} }

Submitted_Assignment.belongsTo(Assignment, { foreignKey: {name: 'assignment_id'} });
Submitted_Assignment.belongsTo(Student, { foreignKey: {name: 'student_id'} });
Submitted_Assignment.belongsTo(Mentor, { foreignKey: {name: 'mentor_id'} });

module.exports = Submitted_Assignment;