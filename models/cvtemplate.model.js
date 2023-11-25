const { Sequelize, DataTypes, Model } = require('sequelize');

class CVTemplate extends Model {}

CVTemplate.init({
  templateID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  templateName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  templateDescription: {
    type: DataTypes.TEXT,
  },
  templateContent: {
    type: DataTypes.TEXT('long'),
  },
  previewImageURL: {
    type: DataTypes.STRING(255),
    allowNull: false,
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
  modelName: 'CVTemplate',
  tableName: 'CVTemplates',
  timestamps: true,
  underscored: true,
});

module.exports = CVTemplate;
