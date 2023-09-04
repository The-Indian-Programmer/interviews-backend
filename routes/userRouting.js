const express = require("express")
const router = express.Router()
const path = require("path")

const UserController = require("../controllers/user.controller.js")

router.post("/get-details", UserController.getUserDetails)
router.post("/update-profile", helper.verifyToken, UserController.updateProfile)
router.post("/update-follow-status", helper.verifyToken, UserController.updateFollowStatus)

module.exports = router
