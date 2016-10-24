'use strict';
module.exports = function(sequelize, DataTypes) {
  var School = sequelize.define('School', {
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        School.hasMany(models.Student);
        School.hasMany(models.Mentor);
        School.hasMany(models.Assignment);
      }
    }
  });
  return School;
};