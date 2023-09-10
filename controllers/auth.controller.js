"use strict"

require("dotenv").config()

const jwt = require("jsonwebtoken")
const UserModel = require("../models/user.model.js")
/**
 * @api {post} /auth/create-user Create User
 * @apiName Create User
 * @apiGroup Auth
 * @param {String} username Username, required
 * @param {String} password Password, required
 * @apiSuccess {Boolean} status Status of the request.
 * @apiSuccess {String} message Message of the request.
**/

module.exports.createUser = (req, res) => {
    let formData = req.body
    let schema = {
        "username": "required",
        "password": "required",
    }
    // validate request
    const validateData = new node_validator.Validator(formData, schema);
    validateData.check().then(async (matched) => {
        if (!matched) return res.status(422).json({ status: false, message: 'Invalid request data', error: validateData.errors });

        try {
            // check if user already exists
            let info = {}
            info.columns = ['userID']
            info.table = 'users'
            info.where = {
                username: formData.username
            }

            let userExistsCheck = await UserModel.findOne({ where: info.where, attributes: info.columns })


            if (!helper.isEmpty(userExistsCheck)) return res.status(409).json({ status: false, message: msgHelper.msg('MSG005') });



            // insert user
            let currentTime = moment().format('YYYY-MM-DD HH:mm:ss')
            let info2 = {}
            info2.data = {
                username: formData.username,
                password: helper.encrypt(formData.password),
                createdAt: currentTime,
                updatedAt: currentTime
            }

            let userInsert = await UserModel.create(info2.data)


            if (helper.isEmpty(userInsert)) return res.status(500).json({ status: false, message: msgHelper.msg('MSG002'), error: userInsert });


            res.status(201).json({ status: true, message: msgHelper.msg('MSG008'), data: userInsert.dataValues.userId });
        } catch (error) {
            res.status(500).json({ status: false, message: msgHelper.msg('MSG002'), error: error.message });
        }
    })

}

/**
 * @api {post} /auth/login Login
 * @apiName Login
 * @apiGroup Auth
 * @param {String} username Username, required
 * @param {String} password Password, required
 * @apiSuccess {Boolean} status Status of the request.
 * @apiSuccess {String} message Message of the request.
**/

module.exports.login = (req, res) => {
    let formData = req.body
    let schema = {
        "username": "required",
        "password": "required",
    }

    // validate request
    const validateData = new node_validator.Validator(formData, schema);
    validateData.check().then(async (matched) => {
        if (!matched) return res.status(422).json({ status: false, message: 'Invalid request data', error: validateData.errors });

        try {
            // check if user exists
            let info = {}
            info.columns = ['userID', 'username', 'password']
            info.table = 'users'
            info.where = { username: formData.username }

            let userExistCheck = await UserModel.findOne({ where: info.where, attributes: info.columns })

            if (helper.isEmpty(userExistCheck)) return res.status(404).json({ status: false, message: msgHelper.msg('MSG006') });

            // check password
            if (helper.decrypt(userExistCheck.dataValues.password) !== formData.password) return res.status(401).json({ status: false, message: msgHelper.msg('MSG007') });

            // generate token
            let token = jwt.sign({ userID: userExistCheck.dataValues.userID, username: userExistCheck.dataValues.username }, process.env.SECRET_TOKEN, { expiresIn: '24h' });

            res.status(200).json({ status: true, message: msgHelper.msg('MSG009'), token: token });

        } catch (error) {
            res.status(500).json({ status: false, message: msgHelper.msg('MSG002'), error: error.message });
        }
    });
}

/**
 * @api {post} /auth/get-user Get User
 * @apiName Get User
 * @apiGroup Auth
 * @apiHeader {String} Authorization Authorization token
 * @apiSuccess {Boolean} status Status of the request.
 * @apiSuccess {String} message Message of the request.
**/

module.exports.getUser = async (req, res) => {

    try {


        const userData = req.authData.user

        if (helper.isEmpty(userData)) return res.status(401).json({ status: false, message: msgHelper.msg('MSG007') });

        let info = {}
        info.columns = ['userID', 'username']
        info.where = { userID: userData.userID }
        info.table = 'users'


        let userDetail = await UserModel.findOne({ where: info.where, attributes: info.columns })


        if (helper.isEmpty(userDetail)) return res.status(500).json({ status: false, message: msgHelper.msg('MSG006'), error: userDetail });

        if (helper.isEmpty(userDetail.dataValues)) return res.status(200).json({ status: false, message: msgHelper.msg('MSG006') });

        res.status(200).json({ status: true, message: msgHelper.msg('MSG011'), data: userDetail.dataValues });
    } catch (error) {
        res.status(500).json({ status: false, message: msgHelper.msg('MSG002'), error: error.message });
    }
}



