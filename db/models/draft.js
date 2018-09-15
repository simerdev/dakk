'use strict';
module.exports = (sequelize, DataTypes) => {
  var Draft = sequelize.define('Draft', {
    dakkId: DataTypes.INTEGER,
    fileName: DataTypes.STRING,
    userId: DataTypes.INTEGER
  },{});
  
  Draft.associate = function(models) {
    Draft.belongsTo(models.Dakk, { foreignKey: 'dakkId' });
  };
  return Draft;
};