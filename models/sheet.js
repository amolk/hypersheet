'use strict';
module.exports = function(sequelize, DataTypes) {
  var Sheet = sequelize.define('Sheet', {
    name: DataTypes.STRING,
    tableName: DataTypes.STRING,

  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    instanceMethods: {
      columns: function() {

      },
      rows: function(args) {
        var columns = '*';
        if (args.columns.length > 0) {
          columns = args.columns.join(',');
        }

        return sequelize.query(
          'SELECT ' + columns + ' from "' + this.tableName + '"',  // TODO: Fix SQL injections!!
          {
            type: sequelize.QueryTypes.SELECT
          }
        )
      }
    }
  });
  return Sheet;
};