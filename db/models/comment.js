'use strict';

const db = require('./connection.js');
const Submitted_Assignment = require('./submitted_assignment.js');

const Comment = db.define('Comment', {
  title: Sequelize.STRING,
  text: Sequelize.STRING,
  type: Sequelize.STRING,
  line_uri: Sequelize.STRING
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

module.exports = Comment;
