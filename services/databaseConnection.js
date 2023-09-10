const { Sequelize } = require('sequelize');
const config = require('../configs/config.js');

const DATABASE_NAME = config.DATABASE_NAME;
const DB_USERNAME = config.DB_USERNAME;
const DB_PASSWORD = config.DB_PASSWORD;
const DB_HOST = config.DB_HOST;
const DB_DIALECT = config.DB_DIALECT;

const sequelize = new Sequelize(DATABASE_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DIALECT,
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = sequelize;
