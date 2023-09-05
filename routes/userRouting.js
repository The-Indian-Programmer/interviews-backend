const express = require("express")
const router = express.Router()
const path = require("path")

const UserController = require("../controllers/user.controller.js")

router.post("/get-details", helper.verifyToken, UserController.getUserDetails)
router.post("/update-profile", helper.verifyToken, UserController.updateProfile)
router.post("/update-follow-status", helper.verifyToken, UserController.updateFollowStatus)
router.post("/get-users", helper.verifyToken, UserController.getUsersList)
router.post("/get-notifications", helper.verifyToken, UserController.getNotificationsList)
router.post("/mark-as-read", helper.verifyToken, UserController.markNotificationAsRead)
module.exports = router
