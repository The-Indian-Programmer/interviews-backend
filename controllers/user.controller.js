"use strict";
require("dotenv").config();

const UserModel = require("../models/user.model");
const PostModel = require("../models/post.model");

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
    const schema = {
        username: "required",
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
            info.where = { username: formData.username };
            info.columns = { password: 0, tokens: 0, updatedAt: 0 };
            const userDetails = await UserModel.getUserOnlyDetail(info.where, info.columns);

            if (!helper.isEmpty(userDetails)) {
                let userId = userDetails._doc._id;

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
                totalFollowers = follower.data.length;


                let totalFollowing = 0;
                let info4 = {};
                info4.where = { follower: userId, };
                const following = await UserModel.getFollowers(info4.where);

                if (!helper.isEmpty(following.err)) return res.status(422).json({ status: false, message: msgHelper.msg("MSG002") });

                totalFollowing = following.data.length;


                let isFollowing = false;
                
                if (!helper.isEmpty(formData.userId)){
                    let info5 = {};
                    info5.where = { follower: formData.userId, following: userId };
                    const isFollow = await UserModel.getFollowers(info5.where);
                    
                    if (!helper.isEmpty(isFollow.err)) return res.status(422).json({ status: false, message: msgHelper.msg("MSG002") });   
                    if (!helper.isEmpty(isFollow.data)) isFollowing = true;
                }



                res.status(200).json({ status: true, message: msgHelper.msg("MSG021"), data: { ...userDetails._doc, posts: userPosts.data, totalFollowers, totalFollowing, isFollowing } });
            } else {
                res.status(422).json({ status: false, message: msgHelper.msg("MSG002") });
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
        if (!matched)
            return res
                .status(422)
                .json({
                    status: false,
                    message: "Invalid request data",
                    error: validateData.errors,
                });

        try {
            if (formData.userId == userDetails._id)
                return res
                    .status(422)
                    .json({ status: false, message: msgHelper.msg("MSG018") });

            /* Check if user exists */
            let info1 = {};
            info1.where = {};

            if (formData.follow) {
                info1.data = { following: formData.userId, follower: userDetails._id };
                const isFollowing = await UserModel.updateFollowStatus(info1.where, info1.data);

                if (!helper.isEmpty(isFollowing.err)) return res.status(422).json({ status: false, message: msgHelper.msg("MSG002"), error: isFollowing.err });

                res.status(200).json({ status: true, message: msgHelper.msg("MSG019"), data: isFollowing.data });

            } else {
                info1.data = { following: formData.userId, follower: userDetails._id };
                const isFollowing = await UserModel.unFollowUser(info1.where, info1.data);

                if (!helper.isEmpty(isFollowing.err)) return res.status(422).json({ status: false, message: msgHelper.msg("MSG002"), error: isFollowing.err });

                res.status(200).json({ status: true, message: msgHelper.msg("MSG020"), data: isFollowing.data });
            }
        } catch (error) {
            res
                .status(422)
                .json({ status: false, message: error.message, error: error });
        }
    });
};
