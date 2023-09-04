"use strict"
require("dotenv").config()

const UserModel = require("../models/user.model")
module.exports.login = (req, res) => {
    let formData = req.body
    let schema = {
        "email": "required|email",
        "password": "required",
    }


    // validate request
    const validateData = new node_validator.Validator(formData, schema);
    validateData.check().then(async (matched) => {
        if (!matched) return res.status(422).json({ status: false, message: 'Invalid request data', error: validateData.errors });

        /* Check if email exists */
        let info = {}
        info.where = { email: formData.email }
        const user = await UserModel.getUser(info.where)

        if (helper.isEmpty(user)) return res.status(422).json({ status: false, message: msgHelper.msg('MSG006') })

        /* Check if password is correct */
        const isPasswordMatch = (user.password === helper.encrypt(formData.password))

        if (!isPasswordMatch) return res.status(422).json({ status: false, message: msgHelper.msg('MSG007') })

        /* Save token */
        const token = await user.generateAuthToken()


        let info2 = {}
        info2.columns = { password: 0, tokens: 0, createdAt: 0, updatedAt: 0 }
        info2.where = { _id: user._doc._id }
        const userDetails = await UserModel.getUserOnlyDetail(info2.where, info2.columns)

        if (helper.isEmpty(userDetails)) return res.status(422).json({ status: false, message: msgHelper.msg('MSG006') })

        res.status(200).json({ status: true, message: msgHelper.msg('MSG009'), data: {...userDetails._doc }, token: token} )


    });
}


module.exports.getUserDetails = async (req, res) => {
    const user = req.authData.user

    if (helper.isEmpty(user)) return res.status(422).json({ status: false, message: msgHelper.msg('MSG006') })

    let info = {}
    info.columns = { password: 0, tokens: 0 }
    info.where = { _id: user._id }
    const userDetails = await UserModel.getUserOnlyDetail(info.where, info.columns)

    if (helper.isEmpty(userDetails)) return res.status(422).json({ status: false, message: msgHelper.msg('MSG006') })

    res.status(200).json({ status: true, message: 'User details fetched successfully', data: { user: userDetails, } })
}



module.exports.logout = async (req, res) => {
    const user = req.authData.user
    if (helper.isEmpty(user)) return res.status(422).json({ status: false, message: msgHelper.msg('MSG006') })

    let info = {}
    info.where = { _id: user._id }
    info.data = { $pull: { tokens: { token: req.token } } }
    const logout = await UserModel.updateUser(info.where, info.data)

    if (helper.isEmpty(logout)) return res.status(422).json({ status: false, message: msgHelper.msg('MSG006') })

    res.status(200).json({ status: true, message: msgHelper.msg('MSG010') })
}