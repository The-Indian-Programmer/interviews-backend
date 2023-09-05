"use strict";
require("dotenv").config();

const UserModel = require("../models/user.model");
const PostModel = require("../models/post.model");
const NotificationModel = require("../models/notification.model");
const { default: mongoose } = require("mongoose");

module.exports.createUser = (req, res) => {
    let formData = req.body;
    let schema = {
        username: "required",
        email: "required|email",
        password: "required",
    };
    // validate request
    const validateData = new node_validator.Validator(formData, schema);
    validateData.check().then(async (matched) => {
        if (!matched)
            return res
                .status(422)
                .json({
                    status: false,
                    message: "Invalid request data",
                    error: validateData.errors,
                });

        /* Check if email exists */
        let info = {};
        info.where = { email: formData.email };
        const isEmailExists = await UserModel.getUser(info.where);

        if (!helper.isEmpty(isEmailExists))
            return res
                .status(422)
                .json({ status: false, message: msgHelper.msg("MSG004") });

        /* Check if username exists */
        info.where = { username: formData.username };
        const isUsernameExists = await UserModel.getUser(info.where);

        if (!helper.isEmpty(isUsernameExists))
            return res
                .status(422)
                .json({ status: false, message: msgHelper.msg("MSG005") });

        /* Create user and save token */
        const user = await UserModel.createUser(formData);

        if (!helper.isEmpty(user)) {
            res
                .status(200)
                .json({
                    status: true,
                    message: msgHelper.msg("MSG008"),
                    data: user.email,
                });
        } else {
            res.status(422).json({ status: false, message: msgHelper.msg("MSG002") });
        }
    });
};

module.exports.getUserDetails = (req, res) => {
    const formData = req.body;
    const loggedInUser = req.authData.user;
    const schema = {
        userId: "required",
    };

    // validate request
    const validateData = new node_validator.Validator(formData, schema);
    validateData.check().then(async (matched) => {
        if (!matched)
            return res
                .status(422)
                .json({
                    status: false,
                    message: "Invalid request data",
                    error: validateData.errors,
                });

        try {
            /* Get user details */
            let info = {};
            info.where = { _id: new mongoose.Types.ObjectId(formData.userId) };
            info.columns = { password: 0, tokens: 0, updatedAt: 0 };
            const userDetails = await UserModel.getDetails(info.where, info.columns);
            if (!helper.isEmpty(userDetails.data)) {
                let userId = formData.userId;


                /* Get user posts */
                let info2 = {};
                info2.where = { author: userId };
                info2.columns = "-updatedAt -likes -comments";
                info2.order = { createdAt: -1 };
                const userPosts = await PostModel.getPostsListByAuthor(info2);

                if (!helper.isEmpty(userPosts.err)) return res.status(422).json({ status: false, message: msgHelper.msg("MSG002") });


                let totalFollowers = 0;
                let info3 = {};
                info3.where = { following: userId, };
                const follower = await UserModel.getFollowers(info3.where);

                if (!helper.isEmpty(follower.err)) return res.status(422).json({ status: false, message: msgHelper.msg("MSG002") });
                totalFollowers = follower.data;


                let totalFollowing = 0;
                let info4 = {};
                info4.where = { follower: userId, };
                const following = await UserModel.getFollowers(info4.where);

                if (!helper.isEmpty(following.err)) return res.status(422).json({ status: false, message: msgHelper.msg("MSG002") });

                totalFollowing = following.data;


                let isFollowing = false;

                if (!helper.isEmpty(formData.userId)) {
                    let info5 = {};
                    info5.where = { following: userId, follower: loggedInUser._id };
                    const isFollow = await UserModel.getFollowers(info5.where);

                    if (!helper.isEmpty(isFollow.err)) return res.status(422).json({ status: false, message: msgHelper.msg("MSG002") });
                    if (!helper.isEmpty(isFollow.data)) isFollowing = true;
                }



                res.status(200).json({ status: true, message: msgHelper.msg("MSG021"), data: { ...userDetails.data._doc, posts: userPosts.data, totalFollowers, totalFollowing, isFollowing } });
            } else {
                res.status(422).json({ status: false, message: msgHelper.msg("MSG002"), error: userDetails.err });
            }
        } catch (error) {
            res.status(422).json({ status: false, message: msgHelper.msg("MSG002") });
        }
    });
};

module.exports.updateProfile = (req, res) => {
    const formData = req.body;
    const userDetails = req.authData.user;
    const schema = {
        username: "required",
        name: "required",
        bio: "required",
        profilePicture: "required",
    };

    // validate request
    const validateData = new node_validator.Validator(formData, schema);
    validateData.check().then(async (matched) => {
        if (!matched)
            return res
                .status(422)
                .json({
                    status: false,
                    message: "Invalid request data",
                    error: validateData.errors,
                });

        try {
            /* Check if username exists */
            let info1 = {};
            info1.where = { username: formData.username };
            const isUsernameExists = await UserModel.getUser(info1.where);

            if (
                !helper.isEmpty(isUsernameExists) &&
                isUsernameExists._id != userDetails._id
            )
                return res
                    .status(422)
                    .json({ status: false, message: msgHelper.msg("MSG005") });

            /* Update user details */
            let info2 = {};
            info2.where = { _id: userDetails._id };
            info2.data = {
                "profile.name": formData.name,
                "profile.bio": formData.bio,
                "profile.profilePicture": formData.profilePicture,
            };
            const user = await UserModel.updateUser(info2.where, info2.data);

            if (!helper.isEmpty(user.err)) {
                res
                    .status(422)
                    .json({ status: false, message: msgHelper.msg("MSG002") });
            } else {
                res
                    .status(200)
                    .json({
                        status: true,
                        message: msgHelper.msg("MSG017"),
                        data: user.data,
                    });
            }
        } catch (error) {
            res.status(422).json({ status: false, message: msgHelper.msg("MSG002") });
        }
    });
};

module.exports.updateFollowStatus = (req, res) => {
    const userDetails = req.authData.user;
    const formData = req.body;
    const schema = {
        userId: "required",
        follow: "required",
    };

    // validate request
    const validateData = new node_validator.Validator(formData, schema);
    validateData.check().then(async (matched) => {
        if (!matched) return res.status(422).json({status: false,message: "Invalid request data", error: validateData.errors});

        try {
            if (formData.userId == userDetails._id) return res.status(422).json({ status: false, message: msgHelper.msg("MSG018") });

            /* Check if user exists */
            let info1 = {};
            info1.where = {};

            if (formData.follow) {
                info1.data = { following: formData.userId, follower: userDetails._id };
                const isFollowing = await UserModel.updateFollowStatus(info1.where, info1.data);

                if (!helper.isEmpty(isFollowing.err)) return res.status(422).json({ status: false, message: msgHelper.msg("MSG002"), error: isFollowing.err });
                res.status(200).json({ status: true, message: msgHelper.msg("MSG019"), data: isFollowing.data });


                /* Emit event to insert data in notifications */
                NotificationEvents.emit('followed-user', { following: formData.userId, follower: userDetails._id, type: 'follow' });


            } else {
                info1.data = { following: formData.userId, follower: userDetails._id };
                const isFollowing = await UserModel.unFollowUser(info1.where, info1.data);

                if (!helper.isEmpty(isFollowing.err)) return res.status(422).json({ status: false, message: msgHelper.msg("MSG002"), error: isFollowing.err });

                res.status(200).json({ status: true, message: msgHelper.msg("MSG020"), data: isFollowing.data });
                NotificationEvents.emit('unfollowed-user', { following: formData.userId, follower: userDetails._id, type: 'follow' });
            }
        } catch (error) {
            res.status(422).json({ status: false, message: error.message, error: error });
        }
    });
};


/*
    @dev: Get all users
    @param: page, perPageItems
*/

module.exports.getUsersList = async (req, res) => {
    let formData = req.body
    let userDetails = req.authData.user
    let schema = {
        "page": "required",
        "perPageItem": "required",
    }
    const validateData = new node_validator.Validator(formData, schema);
    validateData.check().then(async (matched) => {
        if (!matched) return res.status(422).json({ status: false, message: msgHelper.msg('MSG001'), error: validateData.errors });

        try {
            let info = {}
            info = {
                limit: formData.perPageItem,
                offset: (formData.page - 1) * formData.perPageItem,
                where: {},
                order: [
                    ['createdAt', 'DESC']
                ]
            }


            const users = await UserModel.getUsersList(info, userDetails._id);
            const usersCount = await UserModel.getUsersCount(info);

            if (!helper.isEmpty(users.err)) return res.status(500).json({ status: false, message: msgHelper.msg('MSG002'), error: users.err });
            if (!helper.isEmpty(usersCount.err)) return res.status(500).json({ status: false, message: msgHelper.msg('MSG002'), error: usersCount.err });

            const hasMore = (usersCount.data > (formData.page * formData.perPageItem)) ? true : false;



            return res.status(200).json({ status: true, message: msgHelper.msg('MSG014'), data: { data: users.data, hasMore } });

        } catch (error) {
            res.status(500).json({ status: false, message: error.message, error: error });
        }

    });
}



/* 
    @dev: Get all notifications
    @param: page, perPageItems
*/

module.exports.getNotificationsList =  (req, res) => {
    let formData = req.body
    let userDetails = req.authData.user
    let schema = {
        "page": "required",
        "perPageItem": "required",
    }
    const validateData = new node_validator.Validator(formData, schema);
    validateData.check().then(async (matched) => {
        if (!matched) return res.status(422).json({ status: false, message: msgHelper.msg('MSG001'), error: validateData.errors });

        try {
            let info = {}
            info = {
                limit: formData.perPageItem,
                skip: (formData.page - 1) * formData.perPageItem,
                where: { user: new mongoose.Types.ObjectId(userDetails._id) },
                order: [
                    ['createdAt', 'DESC']
                ]
            }

            let allNotifications = await NotificationModel.getNotificationsList(info);
            
            if (!helper.isEmpty(allNotifications.err)) return res.status(500).json({ status: false, message: msgHelper.msg('MSG002'), error: allNotifications.err });


            res.status(200).json({ status: true, message: msgHelper.msg('MSG014'), data: allNotifications.data });

        } catch (error) {
            res.status(500).json({ status: false, message: error.message, error: error });
        }
    });
}


/*
    @dev: Mark notification as read
    @param: notificationId
*/

module.exports.markNotificationAsRead = (req, res) => {
    const formData = req.body;
    const userDetails = req.authData.user;

    const schema = {
        notificationId: "required",
    }

    // validate request
    const validateData = new node_validator.Validator(formData, schema);
    validateData.check().then(async (matched) => {
        if (!matched) return res.status(422).json({ status: false, message: "Invalid request data", error: validateData.errors });

        try {
            let info = {}
            info.where = { _id: new mongoose.Types.ObjectId(formData.notificationId)};
            info.data = { read: true };
            const notification = await NotificationModel.updateNotification(info);

            if (!helper.isEmpty(notification.err)) return res.status(500).json({ status: false, message: msgHelper.msg('MSG002'), error: notification.err });

            res.status(200).json({ status: true, message: msgHelper.msg('MSG022'), data: notification.data });

        } catch (error) {
            res.status(500).json({ status: false, message: error.message, error: error });
        }
    });
}