'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Drafts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      dakkId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        notEmpty: true
      },
      fileName: {
        type: Sequelize.STRING,
        allowNull: false,
        notEmpty: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        notEmpty: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Drafts');
  }
};