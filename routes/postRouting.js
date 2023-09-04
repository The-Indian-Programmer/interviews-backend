const express = require("express")
const router = express.Router()
const path = require("path")
// global.db = require("../models/index")

const PostController = require("../controllers/post.controller.js")

router.post("/create-post", helper.verifyToken, PostController.createPost)
router.post("/get-posts", helper.verifyToken, PostController.getPostsList)
router.post("/delete-post", helper.verifyToken, PostController.deletePost)
router.post("/update-post-like-dislike", helper.verifyToken, PostController.updatePostLikeDislike)

module.exports = router
