'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Dakks', [{
      name: 'Dakk Demo',
      type: 'pdf',
      status: 'open',
      uploadBy: 'Me',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Dakks', null, {});
  }
};
