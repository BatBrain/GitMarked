'use strict';
module.exports = function(sequelize, DataTypes) {
  var Mentor = sequelize.define('Mentor', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    github_name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Mentor.belongsTo(models.School);
        Mentor.hasMany(models.Submitted_Assignment);
      }
    }
  });
  return Mentor;
};