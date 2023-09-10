const express = require("express")
const router = express.Router()
const path = require("path")

const TaskController = require("../controllers/task.controller.js")

router.post("/create-task", helper.verifyToken, TaskController.createTask)
router.post("/update-task", helper.verifyToken, TaskController.updateTask)
router.post("/delete-task", helper.verifyToken, TaskController.deleteTask)
router.post("/update-task-status", helper.verifyToken, TaskController.updateTaskStatus)
router.post("/get-all-tasks", helper.verifyToken, TaskController.getAllTasks)
router.post("/get-task-by-id", helper.verifyToken, TaskController.getTaskDetails)
router.post("/get-tasks-info", helper.verifyToken, TaskController.getTasksInfo)
module.exports = router
