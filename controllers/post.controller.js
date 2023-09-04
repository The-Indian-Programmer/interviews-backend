"use strict"
require("dotenv").config()

const postModel = require("../models/post.model.js")

module.exports.createPost = (req, res) => {
    const userDetail = req.authData.user
    let formData = req.body
    const files = req.files ? req.files.files : []


    let schema = {
        "postContent": "required",
    }

    const validateData = new node_validator.Validator(formData, schema);
    validateData.check().then(async (matched) => {
        if (!matched) return res.status(422).json({ status: false, message: msgHelper.msg('MSG001'), error: validateData.errors });

        let newTempFiles = [];
        if (files.length == undefined) {
            newTempFiles.push(files);
        } else {
            newTempFiles = files;
        }

        try {

            let oldFiles = formData.oldFiles ? JSON.parse(formData.oldFiles) : []

            let newFiles = []

            /* Upload files to cloudinary */
            async.forEachOf(newTempFiles, (file, key, callback) => {
                helper.uploadSingleFile(file, (error, result) => {
                    if (error) return callback(error);
                    newFiles.push(result);
                    callback();
                })
            }, async function (err) {
                if (err) return res.status(500).json({ status: false, message: msgHelper.msg('MSG002'), error: err });

                formData.oldFiles = JSON.stringify([...oldFiles, ...newFiles])


                console.log("formData", formData)
                let currentTime = moment().format("YYYY-MM-DD HH:mm:ss")
                let info = {}
                info.data = {
                    postContent: formData.postContent,
                    files: JSON.parse(formData.oldFiles).map((item) => {
                        return {
                            url: item.url,
                            type: item.type
                        }
                    }),
                    author: userDetail._id,
                    createdBy: userDetail._id,
                    updatedBy: userDetail._id,
                    createdAt: currentTime,
                    updatedAt: currentTime,
                }

                const post = await postModel.createPost(info.data);
                if (!helper.isEmpty(post.err)) return res.status(500).json({ status: false, message: msgHelper.msg('MSG002'), error: post.err });

                return res.status(200).json({ status: true, message: msgHelper.msg('MSG022'), data: post.data._id });
            });


        } catch (error) {
            res.status(500).json({ status: false, message: error.message, error: error });
        }

    })
}

/*
    @dev: Get all posts
    @param: page, perPageItems
*/

module.exports.getPostsList = async (req, res) => {
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


            const posts = await postModel.getPostsList(info, userDetails._id);
            const postCount = await postModel.getPostsCount(info);

            if (!helper.isEmpty(posts.err)) return res.status(500).json({ status: false, message: msgHelper.msg('MSG002'), error: posts.err });
            if (!helper.isEmpty(postCount.err)) return res.status(500).json({ status: false, message: msgHelper.msg('MSG002'), error: postCount.err });

            const hasMore = (postCount.data > (formData.page * formData.perPageItem)) ? true : false;

            return res.status(200).json({ status: true, message: msgHelper.msg('MSG014'), data: { data: posts.data, hasMore } });

        } catch (error) {
            res.status(500).json({ status: false, message: error.message, error: error });
        }

    });
}


/* Delete post
    @param: postId
    @dev: Delete post-> Changes only status of post
*/

module.exports.deletePost = async (req, res) => {
    const userDetail = req.authData.user
    const formData = req.body
    const schema = {
        "postId": "required",
    }
    const validateData = new node_validator.Validator(formData, schema);
    validateData.check().then(async (matched) => {

        if (!matched) return res.status(422).json({ status: false, message: msgHelper.msg('MSG001'), error: validateData.errors });

        try {
            // Check validation if current author is same as post author
            let columns = ["author"]
            const post = await postModel.getPostById({ postId: formData.postId, columns });

            if (!helper.isEmpty(post.err)) return res.status(500).json({ status: false, message: msgHelper.msg('MSG002'), error: post.err });

            if (post.data.author != userDetail._id) return res.status(422).json({ status: false, message: msgHelper.msg('MSG015'), error: null });

            let info = {}
            info.where = {
                _id: formData.postId
            }
            info.data = {
                status: "deleted",
            }

            const postUpdate = await postModel.updatePost(info);
            if (!helper.isEmpty(postUpdate.err)) return res.status(500).json({ status: false, message: msgHelper.msg('MSG002'), error: postUpdate.err });

            return res.status(200).json({ status: true, message: msgHelper.msg('MSG016'), data: null });


        } catch (error) {
            res.status(500).json({ status: false, message: error.message, error: error });
        }
    });
}

/* Update Post like and dislike */
module.exports.updatePostLikeDislike = (req, res) => {
    const formData = req.body
    const userDetail = req.authData.user
    const schema = {
        "postId": "required",
        "like": "required",
    }

    const validateData = new node_validator.Validator(formData, schema);
    validateData.check().then(async (matched) => {
        if (!matched) return res.status(422).json({ status: false, message: msgHelper.msg('MSG001'), error: validateData.errors });

        try {
            let info = {}
            info.where = {
                _id: formData.postId
            }
            // push or pull the user id in like or dislike array
            if (formData.like) {
                info.data = {
                    $addToSet: { likes: userDetail._id }
                }
            } else {
                info.data = {
                    $pull: { likes: userDetail._id }
                }
            }

            const postUpdate = await postModel.updatePost(info);
            if (!helper.isEmpty(postUpdate.err)) return res.status(500).json({ status: false, message: msgHelper.msg('MSG002'), error: postUpdate.err });

            return res.status(200).json({ status: true, message: msgHelper.msg('MSG017'), data: { userId: userDetail._id, postId: formData.postId } });

        } catch (error) {
            res.status(500).json({ status: false, message: error.message, error: error });
        }
    });
}


module.exports.updatePost = (req, res) => {
    const userDetail = req.authData.user
    let formData = req.body
    const files = req.files ? req.files.files : []


    let schema = {
        "postContent": "required",
        "postId": "required",
    }

    const validateData = new node_validator.Validator(formData, schema);
    validateData.check().then(async (matched) => {
        if (!matched) return res.status(422).json({ status: false, message: msgHelper.msg('MSG001'), error: validateData.errors });

        let newTempFiles = [];
        if (files.length == undefined) {
            newTempFiles.push(files);
        } else {
            newTempFiles = files;
        }

        try {

            let oldFiles = formData.oldFiles ? JSON.parse(formData.oldFiles) : []

            let newFiles = []

            /* Upload files to cloudinary */
            async.forEachOf(newTempFiles, (file, key, callback) => {
                helper.uploadSingleFile(file, (error, result) => {
                    if (error) return callback(error);
                    newFiles.push(result);
                    callback();
                })
            }, async function (err) {
                if (err) return res.status(500).json({ status: false, message: msgHelper.msg('MSG002'), error: err });

                formData.oldFiles = JSON.stringify([...oldFiles, ...newFiles])

                let currentTime = moment().format("YYYY-MM-DD HH:mm:ss")
                let info = {}
                info.data = {
                    postContent: formData.postContent,
                    files: JSON.parse(formData.oldFiles).map((item) => {
                        return {
                            url: item.url,
                            type: item.type
                        }
                    }),
                    author: userDetail._id,
                    createdBy: userDetail._id,
                    updatedBy: userDetail._id,
                    createdAt: currentTime,
                    updatedAt: currentTime,
                }
                info.where = {
                    _id: formData.postId
                }

                const post = await postModel.updatePost(info);
                if (!helper.isEmpty(post.err)) return res.status(500).json({ status: false, message: msgHelper.msg('MSG002'), error: post.err });

                return res.status(200).json({ status: true, message: msgHelper.msg('MSG023'), data: formData.postId });
            });


        } catch (error) {
            res.status(500).json({ status: false, message: error.message, error: error });
        }

    })
}



module.exports.getPostbyPostId = async (req, res) => {
    const formData = req.body
    const userDetail = req.authData.user

    const schema = {
        "postId": "required",
    }

    const validateData = new node_validator.Validator(formData, schema);
    validateData.check().then(async (matched) => {
        if (!matched) return res.status(422).json({ status: false, message: msgHelper.msg('MSG001'), error: validateData.errors });

        try {
            let info = {}
            info.where = {
                _id: formData.postId
            }

            const post = await postModel.getPostById(info);
            if (!helper.isEmpty(post.err)) return res.status(500).json({ status: false, message: msgHelper.msg('MSG002'), error: post.err });

            return res.status(200).json({ status: true, message: msgHelper.msg('MSG014'), data: post.data });

        } catch (error) {
            res.status(500).json({ status: false, message: error.message, error: error });
        }
    });
}