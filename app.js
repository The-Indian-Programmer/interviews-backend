const express = require("express");
var cors = require("cors");
global.moment = require("moment");
global.node_validator = require("node-input-validator");
global.cookieParser = require('cookie-parser');
global.helper = require("./helper/helper.js");
global.msgHelper = require("./helper/msg.js");
global.async = require("async");
const logger = require('morgan');


const bodyParser = require("body-parser");
const fileUploader = require('express-fileupload');

const path = require("path");
const apiRouting = require("./routes/apiRouting");
const authRouting = require("./routes/authRouting");
const postRouting = require("./routes/postRouting");
const userRouting = require("./routes/userRouting");
const multer = require("multer");
const app = express();
require("dotenv").config(); //instatiate environment variables

require("./services/databaseConnection");

global.NotificationEvents = require("./events/NotificationEvents.js")

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());



const upload = multer(); // Initialize multer

// Allow all file types to be uploaded

// app.use(upload.array());
app.use(fileUploader());

const CONFIG = require("./config/config.js");



console.log("Environment:", CONFIG.ENVIRONMENT);



app.use("/api", apiRouting);
app.use("/auth", authRouting);
app.use("/post", postRouting);
app.use("/user", userRouting);


// return 404 if no route matched
app.use((req, res) => {
  res.status(404).json({ status: false, message: "Route not found"});
});

module.exports = app;
