'use strict';
module.exports = (sequelize, DataTypes) => {
  var Role = sequelize.define('role', {
    roleId: DataTypes.INTERGER,
    roleName: DataTypes.STRING
  }, {});
  Role.associate = function(models) {
    // associations can be defined here
  };
  return Role;
};