'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('dakks', 'speakOn', {
        type: Sequelize.BOOLEAN,
        allowNull: false, 
        defaultValue: false
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('dakks', 'speakOn');
  }
};
