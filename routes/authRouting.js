const express = require("express")
const router = express.Router()
const path = require("path")

const AuthController = require("../controllers/auth.controller.js")

router.post("/login", AuthController.login)
router.get("/get-detail", helper.verifyToken, AuthController.getUserDetails)
router.get("/logout", helper.verifyToken, AuthController.logout)

module.exports = router
