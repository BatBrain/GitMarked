'use strict';
module.exports = function(sequelize, DataTypes) {
  var Comment = sequelize.define('Comment', {
    title: DataTypes.STRING,
    text: DataTypes.STRING,
    type: DataTypes.STRING,
    line_uri: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Comment.belongsTo(models.Submitted_Assignment);
      }
    }
  });
  return Comment;
};