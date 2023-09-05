"use strict"
require("dotenv").config()

const moment = require("moment");
const notificationModel = require("../models/notification.model.js");
const postModel = require("../models/post.model.js");
module.exports.addFollowNotification = async (data) => {

    let currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
    let {following, follower, type} = data;

    if (following == follower) return {err: "You can't follow yourself", result: null}

    let notificationData = {
        user: following ,
        type: type,
        actionBy: follower,
        createdAt: currentTime,
        read: false
    }
    notificationData["type"] = "follow";
    notificationData["post"] = null;

    let addNotification = await notificationModel.addNotification(notificationData);

    if (!helper.isEmpty(addNotification.err)) {
        console.log("Error while adding notification", addNotification.err);
        return {err: addNotification.err, result: null}
    } else {
        return {err: null, result: addNotification.data}
    }

}


module.exports.addUnFollowNotification = async (data) => {
    /*
        We will check if current follow notification is read or not
        if not read then we will delete that notification
        else we will add new notification
    */
    let currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
    let {following, follower, type} = data;

    if (following == follower) return {err: "You can't follow yourself", result: null}

    // Check if notification is read or not
    let notificationData = {}
    notificationData.where = {
        user: following  ,
        type: type,
        actionBy: follower,
        read: false
    }
    notificationData.columns = "_id read";

    let notificationInfo = await notificationModel.deleteAllNotifications(notificationData);

    if (!helper.isEmpty(notificationInfo.err)) return {err: notificationInfo.err, result: null}

    return {err: null, result: notificationInfo.data}    
}


module.exports.addLikedPostNotification = async (data) => {
    
        let currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
        let {postId, userId, type, authorId} = data;
    

        if (authorId == userId) return {err: "You can't like your own post", result: null}

        let notificationData = {
            user: authorId ,
            type: type,
            actionBy: userId,
            createdAt: currentTime,
            read: false
        }
        notificationData["type"] = "like";
        notificationData["post"] = postId;
    
        let addNotification = await notificationModel.addNotification(notificationData);
    
        if (!helper.isEmpty(addNotification.err)) {
            console.log("Error while adding notification", addNotification.err);
            return {err: addNotification.err, result: null}
        } else {
            return {err: null, result: addNotification.data}
        }
    
}

module.exports.addUnLikePostNotification = async (data) => {
    /*
        We will check if current like notification is read or not
        if not read then we will delete that notification
        else we will add new notification
    */
    let currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
    let {postId, userId, authorId, type} = data;

    if (authorId == userId) return {err: "You can't like your own post", result: null}

    // Check if notification is read or not
    let notificationData = {}
    notificationData.where = {
        user: authorId ,
        type: type,
        postId: postId,
        actionBy: userId,
    }

    let notificationInfo = await notificationModel.deleteAllNotifications(notificationData);

    if (!helper.isEmpty(notificationInfo.err)) return {err: notificationInfo.err, result: null}

    return {err: null, result: notificationInfo.data}    
}


module.exports.commentedPost = async (data) => {
    let currentTime = moment().format("YYYY-MM-DD HH:mm:ss");

    let {userId, postId, type} = data;

    let postInfo = await postModel.getPostById(postId);

    if (!helper.isEmpty(postInfo.err)) return {err: postInfo.err, result: null}


    if (postInfo.data.author == userId) return {err: "You can't comment on your own post", result: null}

    let notificationData = {
        user: postInfo.data.author,
        type: type,
        actionBy: userId,
        createdAt: currentTime,
        read: false
    }

    notificationData["type"] = "comment";
    notificationData["post"] = postId;

    let addNotification = await notificationModel.addNotification(notificationData);

    if (!helper.isEmpty(addNotification.err)) {
        console.log("Error while adding notification", addNotification.err);
        return {err: addNotification.err, result: null}
    } else {
        return {err: null, result: addNotification.data}
    }
}