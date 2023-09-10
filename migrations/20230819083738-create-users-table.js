'use strict';

/** @type {import('sequelize-cli').Migration} */

const { DataTypes } = require('sequelize');
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      userID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      }, 
      username: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING(64),
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    })

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
