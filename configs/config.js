require("dotenv").config() //instatiate environment variables

let CONFIG = {} //Make this global to use all over the application

CONFIG.NODE_ENV = process.env.NODE_ENV || "development"
CONFIG.ENVIRONMENT = process.env.ENVIRONMENT || "localhost"
CONFIG.PORT = process.env.PORT || "3500"

CONFIG.DB_DIALECT = process.env.DB_DIALECT || "mysql"
CONFIG.DB_HOST = process.env.DB_HOST || "localhost"
CONFIG.DB_PORT = process.env.DB_PORT || "3306"
CONFIG.DATABASE_NAME = process.env.DATABASE_NAME || "name"
CONFIG.DB_USERNAME = process.env.DB_USERNAME || "root"
CONFIG.DB_PASSWORD = process.env.DB_PASSWORD || "123456"

module.exports = CONFIG
