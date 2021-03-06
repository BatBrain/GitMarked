'use strict';

const Sequelize = require('sequelize');
const db = require('./connection.js');
const Submitted_Assignment = require('./submitted_assignment.js');
const File = require('./file.js');

const Comment = db.define('Comment', {
  title: Sequelize.STRING,
  text: Sequelize.STRING,
  type: Sequelize.STRING,
  line_start: Sequelize.INTEGER,
  line_end: Sequelize.INTEGER,
  file_id: Sequelize.INTEGER
});

//   , {
//     classMethods: {
//       associate: function(models) {
//         // associations can be defined here
//         Comment.belongsTo(models.Submitted_Assignment);
//       }
//     }
//   });
//   return Comment;
// };

Comment.belongsTo(Submitted_Assignment, { foreignKey: {name: 'sub_assign_id'} });
Comment.belongsTo(File, { foreignKey: {name: 'file_id'} });

module.exports = Comment;
