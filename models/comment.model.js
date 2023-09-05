const commentSchema = require("../schema/comment.schema");
const mongoose = require("mongoose");
let CommentModel = {};


CommentModel.addPostComment = (data) => {
    return new Promise((resolve, reject) => {
        const comment = new commentSchema(data);
        comment.save().then((result) => {
            resolve({ err: null, data: result });
        }).catch((err) => {
            reject({ err: err, data: null });
        })
    })
}


CommentModel.updateComment = (data) => {
    return new Promise((resolve, reject) => {
        let {postId, userId, commentId, commentContent} = data;

        commentSchema.updateOne(
            { _id: commentId, postId: postId, userId: userId },
            { $set: { commentContent: commentContent } }
        ).then((result) => {
            resolve({ err: null, data: result });
        }).catch((err) => {
            reject({ err: err, data: null });
        });
    });
}

CommentModel.deleteComment = (data) => {
    return new Promise((resolve, reject) => {
        let {postId, userId, commentId} = data;

        commentSchema.updateOne(
            { _id: commentId, postId: postId, userId: userId },
            { $set: { status: "deleted" } }
        ).then((result) => {
            resolve({ err: null, data: result });
        }).catch((err) => {
            reject({ err: err, data: null });
        });
    });
}

CommentModel.getComment = (data) => {
    return new Promise((resolve, reject) => {
        let {postId, userId} = data;

        let where = {}

        if (!helper.isEmpty(postId)) {
            where.postId = new mongoose.Types.ObjectId(postId);
        }
         
        if (!helper.isEmpty(userId)) {
            where.userId = new mongoose.Types.ObjectId(userId);
        }

        // get user info also
        commentSchema.aggregate([
            {
                $match: where
            },{
                $lookup: {
                  from: "users",
                  localField: "userId",
                  foreignField: "_id",
                  as: "user"
                }
              },
              {
                $unwind: "$user",
                
              },
              {
                $project: {
                  _id: 1,
                  "comment": 1,
                  "user.profile.profilePicture": 1,
                  "user._id": 1,
                  "user.username": 1,
                }
              }
              
        ]).then((result) => {
            resolve({ err: null, data: result });
        }).catch((err) => {
            reject({ err: err, data: null });
        });
    });
};



module.exports = CommentModel;