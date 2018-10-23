'use strict';
module.exports = (sequelize, DataTypes) => {
  const SpeakOn = sequelize.define('SpeakOn', {
    dakkId: DataTypes.INTEGER
  }, {});
  return SpeakOn;
};