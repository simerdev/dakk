'use strict';
module.exports = (sequelize, DataTypes) => {
  var Files = sequelize.define('files', {
    name: DataTypes.STRING,
    file: DataTypes.STRING,
    dakkId: DataTypes.INTEGER
  }, {});
  Files.associate = function(models) {
    // associations can be defined here
    // Files.belongsTo(models.Dakk, { foreignKey: 'dakkId' });
  };
  return Files;
};