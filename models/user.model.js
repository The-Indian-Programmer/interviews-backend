const { Sequelize, DataTypes, Model } = require('sequelize');

class User extends Model {}

User.init({
  // Model attributes are defined here
  userID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  userName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING(20),
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  googleAccountID: {
    type: DataTypes.STRING(255),
    unique: true,
  },
  facebookAccountID: {
    type: DataTypes.STRING(255),
    unique: true,
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
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'User', // We need to choose the model name
  tableName: 'users', // Optional: Set the table name explicitly
  timestamps: true, // Optional: Sequelize will automatically create createdAt and updatedAt columns
  underscored: true, // Optional: Use snake_case instead of camelCase for automatically added attributes
});

module.exports = User;
