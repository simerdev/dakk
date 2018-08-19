'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Dakk', [{
      name: 'Dakk Demo',
      type: 'pdf',
      filePath: 'demoPath',
      status: 'open',
      uploadBy: 'Me',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Dakk', null, {});
  }
};
