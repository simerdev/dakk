'use strict';
module.exports = (sequelize, DataTypes) => {
  var Dakk = sequelize.define('dakk', {
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    status: DataTypes.STRING,
    uploadBy: DataTypes.STRING,
    speakOn: DataTypes.BOOLEAN
  }, {});
  Dakk.associate = function(models) {
    // associations can be defined here
    Dakk.hasMany(models.Files, {foreignKey: 'dakkId'});
    Dakk.hasMany(models.Drafts, {foreignKey: 'dakkId'});
  };
  return Dakk;
};