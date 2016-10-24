'use strict';
module.exports = function(sequelize, DataTypes) {
  var Assignment = sequelize.define('Assignment', {
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Assignment.belongsTo(models.School);
        Assignment.hasMany(models.Submitted_Assignment);
      }
    }
  });
  return Assignment;
};