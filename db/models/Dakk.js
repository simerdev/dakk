'use strict';
module.exports = (sequelize, DataTypes) => {
  var Dakk = sequelize.define('Dakk', {
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    filePath: DataTypes.STRING,
    status: DataTypes.STRING,
    uploadBy: DataTypes.STRING
  }, {});
  Dakk.associate = function(models) {
    // associations can be defined here
    Dakk.hasMany(models.Files, {foreignKey: 'id'});
    Dakk.hasMany(models.Drafts, {foreignKey: 'id'});

  };
  return Dakk;
};