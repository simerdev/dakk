'use strict';
module.exports = (sequelize, DataTypes) => {
  const Notifications = sequelize.define('Notifications', {
    userId: DataTypes.INTEGER,
    message: DataTypes.STRING,
    read: DataTypes.BOOLEAN
  }, {});
  Notifications.associate = function(models) {
    // associations can be defined here
  };
  return Notifications;
};