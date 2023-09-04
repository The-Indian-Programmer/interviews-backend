require("dotenv").config() //instatiate environment variables

let CONFIG = {} //Make this global to use all over the application

CONFIG.ENVIRONMENT = process.env.ENVIRONMENT || "localhost"


CONFIG.DB_DIALECT = process.env.DB_DIALECT || "mongodb"
CONFIG.DATABASE_HOST = process.env.DATABASE_HOST || "localhost"
CONFIG.DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost:27017"
CONFIG.DATABASE_NAME = process.env.DATABASE_NAME || "websulanate-social-media-app"
CONFIG.DATABASE_USERNAME = process.env.DATABASE_USERNAME || "root"
CONFIG.DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || "root"
CONFIG.DATABASE_PORT = process.env.DATABASE_PORT || "27017"
CONFIG.DATABASE_AUTH_SOURCE = process.env.DATABASE_AUTH_SOURCE || "admin"

module.exports = CONFIG
