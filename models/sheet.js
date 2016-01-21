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
      rows: async function(args) {
        var columns = '*';
        if (args != null && args.columns != null && args.columns.length > 0) {
          columns = args.columns.join(',');
        }

        return await sequelize.query(
          'SELECT ' + columns + ' from "' + this.tableName + '"',  // TODO: Fix SQL injections!!
          {
            type: sequelize.QueryTypes.SELECT
          }
        )
      },

      columnInfos: async function() {
        var info = await sequelize.query(
          "SELECT * FROM information_schema.columns WHERE table_schema = 'public' AND table_name ='" + this.tableName + "'", // TODO: Fix SQL injections!!
          {
            type: sequelize.QueryTypes.SELECT
          }
        );

        return info.map((i) => {return {name: i.column_name}});
      }
    }
  });
  return Sheet;
};