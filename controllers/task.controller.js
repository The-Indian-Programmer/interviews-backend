"use strict";

const TaskModel = require('../models/task.model');

/**
 * @api {post} /task/create-task Create Task
 * @apiName Create Task
 * @apiGroup Task
 * @param {String} title Task title, required
 * @param {String} description Task description, required
 * @param {String} priority Task priority, required
 * @param {String} dueDate Task due date, required
**/

module.exports.createTask = (req, res) => {
    let formData = req.body;
    const userData = req.authData.user;
    let schema = {
        "title": "required",
        "description": "required",
        "priority": "required",
        "dueDate": "required"
    };
    // validate request
    const validateData = new node_validator.Validator(formData, schema);
    validateData.check().then(async matched => {
        if (!matched) return res.status(422).json({ status: false, message: 'Invalid request data', error: validateData.errors });

        try {
            // insert task
            let currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
            let dueDate = moment(formData.dueDate, 'YYYY-MM-DD').format('YYYY-MM-DD HH:mm:ss');
            let info2 = {};
            info2.data = {
                title: formData.title,
                description: formData.description,
                userID: userData.userID,
                taskStatus: 'pending', // default status (0ptional)
                priority: !helper.isEmpty(formData.priority) ? formData.priority : 'low',   // default priority (optional)
                dueDate: dueDate,
                createdAt: currentTime,
                updatedAt: currentTime
            };

            let taskInsert = await TaskModel.create(info2.data);


            if (helper.isEmpty(taskInsert)) return res.status(400).json({ status: false, message: msgHelper.msg('MSG002'), error: taskInsert.err.message });

            return res.status(200).json({ status: true, message: msgHelper.msg('MSG012'), data: taskInsert.dataValues.taskId });
        } catch (error) {
            return res.status(500).json({ status: false, message: msgHelper.msg('MSG002'), error: error.message });
        }
    });
};

/**
 * @api {post} /task/update-task Update Task
 * @apiName Update Task
 * @apiGroup Task
 * @param {String} taskID Task ID, required
 * @param {String} title Task title, required
 * @param {String} description Task description, required
 * @param {String} status Task status, required
 * @param {String} priority Task priority, required
 * @param {String} dueDate Task due date, required
 * @apiSuccess {Boolean} status Status of the request.
**/


module.exports.updateTask = (req, res) => {
    let formData = req.body;
    let schema = {
        "taskID": "required",
        "title": "required",
        "description": "required",
        "priority": "required",
        "dueDate": "required"
    };
    // validate request
    const validateData = new node_validator.Validator(formData, schema);
    validateData.check().then(async matched => {
        if (!matched) return res.status(422).json({ status: false, message: 'Invalid request data', error: validateData.errors });

        try {
            // update task
            let currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
            let dueDate = moment(formData.dueDate, 'YYYY-MM-DD').format('YYYY-MM-DD HH:mm:ss');
            let info2 = {};
            info2.data = {
                title: formData.title,
                description: formData.description,
                dueDate: dueDate,
                updatedAt: currentTime
            };

    

            if (!helper.isEmpty(formData.status)) info2.data.status = formData.status;
            if (!helper.isEmpty(formData.priority)) info2.data.priority = formData.priority;


            info2.where = { taskID: formData.taskID };

            let taskUpdate = await TaskModel.update(info2.data, { where: info2.where });

            if (helper.isEmpty(taskUpdate)) return res.status(400).json({ status: false, message: msgHelper.msg('MSG002'), error: taskUpdate });


            res.status(200).json({ status: true, message: msgHelper.msg('MSG013') });
        } catch (error) {
            return res.status(500).json({ status: false, message: msgHelper.msg('MSG002'), error: error.message });
        }
    });
}

/**
 * @api {post} /task/delete-task Delete Task
 * @apiName Delete Task
 * @apiGroup Task
 * @param {String} taskID Task ID, required
 * @apiSuccess {Boolean} status Status of the request.
 * @apiSuccess {String} message Message of the request.
 * @apiSuccess {String} data Data of the request.
 * @apiSuccess {String} error Error of the request.
 * @apiSuccess {String} error.message Error message of the request.
**/

module.exports.deleteTask = (req, res) => {
    let formData = req.body;
    const userData = req.authData.user;
    let schema = {
        "taskID": "required"
    };
    // validate request
    const validateData = new node_validator.Validator(formData, schema);
    validateData.check().then(async matched => {
        if (!matched) return res.status(422).json({ status: false, message: 'Invalid request data', error: validateData.errors });

        try {

            // check if user own this tasks
            let info = {};
            info.columns = ['taskID','userID'];
            info.table = 'tasks';
            info.where = { taskID: formData.taskID };

            let taskResult = await TaskModel.findOne({ where: info.where, attributes: info.columns });

            if (helper.isEmpty(taskResult)) return res.status(404).json({ status: false, message: msgHelper.msg('MSG014'), data: taskResult });

            if (taskResult.dataValues.userID !== userData.userID) return res.status(401).json({ status: false, message: msgHelper.msg('MSG003') });

            // delete task
            let info2 = {};
            info2.data = {
                status: 'deleted'
            }
            info2.where = { taskID: formData.taskID };

            let taskDelete = await TaskModel.update(info2.data, { where: info2.where });

            if (helper.isEmpty(taskDelete)) return res.status(500).json({ status: false, message: msgHelper.msg('MSG002'), error: taskDelete });

            res.status(200).json({ status: true, message: msgHelper.msg('MSG015'), data: taskDelete });

        } catch (error) {
            return res.status(500).json({ status: false, message: msgHelper.msg('MSG002'), error: error.message });
        }
    });
};


/** 
 * @api {post} /task/update-task-status Update Task Status (Completed/Pending/Ongoing)
 * @apiName Update Task Status (Completed/Pending/Ongoing)
 * @apiGroup Task
 * @param {String} taskID Task ID, required
 * @param {String} status Task status, required
 * @apiSuccess {Boolean} status Status of the request.
 * @apiSuccess {String} message Message of the request.
**/

module.exports.updateTaskStatus = (req, res) => {
    let formData = req.body;
    const userData = req.authData.user;
    let schema = {
        "taskID": "required",
        "status": "required"
    };
    // validate request
    const validateData = new node_validator.Validator(formData, schema);
    validateData.check().then(async matched => {
        if (!matched) return res.status(422).json({ status: false, message: 'Invalid request data', error: validateData.errors });

        try {

            // check if user own this tasks
            let info = {};
            info.columns = ['taskID','userID'];
            info.table = 'tasks';
            info.where = { taskID: formData.taskID };

            let taskResult = await TaskModel.findOne({ where: info.where, attributes: info.columns });

            if (helper.isEmpty(taskResult)) return res.status(404).json({ status: false, message: msgHelper.msg('MSG014'), data: taskResult });

            if (taskResult.dataValues.userID !== userData.userID) return res.status(401).json({ status: false, message: msgHelper.msg('MSG003') });

            // delete task
            let info2 = {};
            info2.data = {
                status: formData.status
            }
            info2.where = { taskID: formData.taskID };

            let taskStatusUpdate = await TaskModel.update(info2.data, { where: info2.where });

            if (helper.isEmpty(taskStatusUpdate)) return res.status(500).json({ status: false, message: msgHelper.msg('MSG002'), error: taskStatusUpdate });

            res.status(200).json({ status: true, message: msgHelper.msg('MSG016'), data: taskStatusUpdate });

        } catch (error) {
            return res.status(500).json({ status: false, message: msgHelper.msg('MSG002'), error: error.message });
        }
    });
}

/** 
    * @api {post} /task/get-all-tasks Get All Tasks
    * @apiName Get All Tasks
    * @apiGroup Task
    * @param page page, required
    * @param perPageItem Per page, required
    * @param order Order Type, required
    * @param orderBy orderBy, required
    * @apiSuccess {Boolean} status Status of the request.
    * @apiSuccess {String} message Message of the request.
    * @apiSuccess {String} data Data of the request.
    * @apiSuccess {String} count Count of the request.
**/

module.exports.getAllTasks = (req, res) => {
    const formData = req.body;
    const userData = req.authData.user;
    const schema = {
        "page": "required",
        "perPageItem": "required",
        "order": "required",
        "orderBy": "required"
    }

    // validate request
    const validateData = new node_validator.Validator(formData, schema);
    validateData.check().then(async matched => {
        if (!matched) return res.status(422).json({ status: false, message: 'Invalid request data', error: validateData.errors });

        try {
            // get all tasks
            let info = {
                "where": {"userID": userData.userID},
                "limit": parseInt(formData.perPageItem),
                "offset": parseInt(formData.page) * parseInt(formData.perPageItem) - parseInt(formData.perPageItem),
                "order": formData.order,
                "orderBy": formData.orderBy
            }

            if (!helper.isEmpty(formData.searchTerm)) info.where.title = { [Sequelize.Op.like]: `%${formData.searchTerm}%` };

            if (!helper.isEmpty(formData.filter.status)) info.where.status = formData.filter.status;
            if (!helper.isEmpty(formData.filter.priority)) info.where.priority = formData.filter.priority;

            let allTasks = await TaskModel.getAllTasks(info);


            if (!helper.isEmpty(allTasks.err)) return res.status(500).json({ status: false, message: msgHelper.msg('MSG002'), error: allTasks.err.message });


            let taskCount = await TaskModel.getAllTaskCount(info);

            if (!helper.isEmpty(taskCount.err)) return res.status(500).json({ status: false, message: msgHelper.msg('MSG002'), error: taskCount.err.message });
            

            res.status(200).json({ status: true, message: msgHelper.msg('MSG017'), data: allTasks.data, count: taskCount.data });
        } catch (error) {
            return res.status(500).json({ status: false, message: msgHelper.msg('MSG002'), error: error.message });
        }
    });
}


/**
 * @api {post} /task/get-task-by-id Get Task By ID
 * @apiName Get Task By ID
 * @apiGroup Task
 * @param {String} taskID Task ID, required
 * @apiSuccess {Boolean} status Status of the request.
 * @apiSuccess {String} message Message of the request.
 * @apiSuccess {String} data Data of the request.
**/

module.exports.getTaskDetails = (req, res) => {
    let formData = req.body;
    let schema = {
        "taskID": "required"
    };
    // validate request
    const validateData = new node_validator.Validator(formData, schema);
    validateData.check().then(async matched => {
        if (!matched) return res.status(422).json({ status: false, message: 'Invalid request data', error: validateData.errors });

        try {
            // get task details
            let info = {};
            info.columns = ['taskID', 'title', 'description', 'status', 'priority', 'dueDate'];
            info.table = 'tasks';
            info.where = { taskID: formData.taskID };

            let taskDetails = await TaskModel.findOne({ where: info.where, attributes: info.columns });

            if (helper.isEmpty(taskDetails)) return res.status(404).json({ status: false, message: msgHelper.msg('MSG014'), data: taskDetails });


            if (helper.isEmpty(taskDetails.dataValues)) return res.status(404).json({ status: false, message: msgHelper.msg('MSG014'), data: taskDetails.dataValues });

            res.status(200).json({ status: true, message: msgHelper.msg('MSG017'), data: taskDetails.dataValues });
        } catch (error) {
            return res.status(500).json({ status: false, message: msgHelper.msg('MSG002'), error: error.message });
        }
    });
}
