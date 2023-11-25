const { Sequelize, DataTypes, Model } = require('sequelize');

class UserCV extends Model {}

UserCV.init({
  userCVID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  templateID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'CVTemplate',
      key: 'templateID',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  userData: {
    type: DataTypes.TEXT('long'),
  },
  status: {
    type: DataTypes.ENUM('draft', 'completed', 'deleted'),
    defaultValue: 'draft',
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'User',
      key: 'userID',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  updatedBy: {
    type: DataTypes.INTEGER,
    references: {
      model: 'User',
      key: 'userID',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
}, {
  modelName: 'UserCV',
  tableName: 'userCVs',
  timestamps: true,
  underscored: true,
});

module.exports = UserCV;
