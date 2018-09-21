'use strict';
module.exports = (sequelize, DataTypes) => {
  var DakkUser = sequelize.define('dakkuser', {
    dakkId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    timestamps: false
  });
  DakkUser.associate = function(models) {
    // associations can be defined here
  };
  return DakkUser;
};