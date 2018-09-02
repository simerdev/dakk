'use strict';
module.exports = (sequelize, DataTypes) => {
  var Files = sequelize.define('Files', {
    name: DataTypes.STRING,
    file: DataTypes.STRING,
    dakkId: DataTypes.INTEGER
  }, {});
  Files.associate = function(models) {
    // associations can be defined here
  };
  return Files;
};