'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('userCVs', {
      userCVID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      templateID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'CVTemplates',
          key: 'templateID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      userData: {
        type: Sequelize.TEXT('long'),
      },
      status: {
        type: Sequelize.ENUM('draft', 'completed', 'deleted'),
        defaultValue: 'draft',
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'userID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      updatedBy: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'userID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('userCVs');
  }
};
