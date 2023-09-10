const express = require("express")
const router = express.Router()
const path = require("path")

const AuthController = require("../controllers/auth.controller.js")

router.post("/register", AuthController.createUser)
router.post("/login", AuthController.login)
router.get("/get-user", helper.verifyToken, AuthController.getUser)

module.exports = router
