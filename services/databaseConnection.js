/* Set Up Mongodb connection */

const mongoose = require('mongoose');

const CONFIG = require('../config/config');

// const MONGODB_URI = `${CONFIG.DB_DIALECT}://${CONFIG.DATABASE_USERNAME}:${CONFIG.DATABASE_PASSWORD}@${CONFIG.DATABASE_HOST}/${CONFIG.DATABASE_NAME}`

const MONGODB_URI = `mongodb+srv://sumitkosta07:FMTqz0SXENeUj8gj@cluster0.ewnuswv.mongodb.net/websulanate-social-media-app`

const MONGODB_OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: false,
    // useFindAndModify: false,
    authSource: CONFIG.DATABASE_AUTH_SOURCE,
    user: CONFIG.DATABASE_USERNAME,
    pass: CONFIG.DATABASE_PASSWORD
}

mongoose.connect(MONGODB_URI, MONGODB_OPTIONS);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => console.log(`Connected to ${CONFIG.DB_DIALECT} database ${CONFIG.DATABASE_NAME} on ${CONFIG.DATABASE_HOST}:${CONFIG.DATABASE_PORT}`));

module.exports = db;