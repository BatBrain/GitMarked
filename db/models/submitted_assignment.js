'use strict';
module.exports = function(sequelize, DataTypes) {
  var Submitted_Assignment = sequelize.define('Submitted_Assignment', {
    assignment_url: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Submitted_Assignment.belongsTo(models.Assignment);
        Submitted_Assignment.belongsTo(models.Student);
        Submitted_Assignment.belongsTo(models.Mentor);
        Submitted_Assignment.hasMany(models.Comment);
      }
    }
  });
  return Submitted_Assignment;
};