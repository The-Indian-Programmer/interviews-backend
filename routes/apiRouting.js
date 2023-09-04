const express = require("express")
const router = express.Router()
const path = require("path")
// global.db = require("../models/index")

const UserController = require("../controllers/user.controller.js")
const CommonController = require("../controllers/common.controller.js")

router.post("/register", UserController.createUser)
router.post("/upload-files", helper.verifyToken, CommonController.uploadFiles)

module.exports = router
