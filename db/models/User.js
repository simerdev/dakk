'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('user', {
    userName: DataTypes.STRING,
    password: DataTypes.STRING,
    roleId: DataTypes.INTEGER
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
