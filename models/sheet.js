'use strict';
module.exports = function(sequelize, DataTypes) {
  var Sheet = sequelize.define('Sheet', {
    name: DataTypes.STRING,
    table_name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Sheet;
};