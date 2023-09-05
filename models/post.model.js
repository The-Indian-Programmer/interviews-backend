const postSchema = require("../schema/posts.schema");
const mongoose = require("mongoose");
let Post = {};

Post.createPost = (data) => {
  return new Promise((resolve, reject) => {
    const post = new postSchema(data);
    post
      .save()
      .then((result) => {
        resolve({ err: null, data: result });
      })
      .catch((err) => {
        reject({ err: err, data: null });
      });
  });
};

Post.getPostsList = (data, userId) => {
  return new Promise((resolve, reject) => {
    let limit = data.limit;
    let skip = data.offset;
    let where = {
      ...data.where,
      status: {
        $ne: "deleted",
      },
    };
    let order = data.order;
    postSchema
      .find(where)
      .sort(order)
      .limit(limit)
      .skip(skip)
      .populate({
        path: "author",
        select: "username profile.name profile.profilePicture",
      })
      .populate({
        path: "likes",
        $elemMatch: !helper.isEmpty(userId) ? { _id: new mongoose.Types.ObjectId(userId) } : {},
        select: "_id",
      })
      .exec()
      .then((result) => {
        resolve({ err: null, data: result });
      })
      .catch((err) => {
        reject({ err: err, data: null });
      });
  });
};

Post.getPostsCount = (data) => {
  return new Promise((resolve, reject) => {
    let where = {
      ...data.where,
      status: {
        $ne: "deleted",
      },
    };

    postSchema
      .countDocuments(where)
      .then((result) => {
        resolve({ err: null, data: result });
      })
      .catch((err) => {
        reject({ err: err, data: null });
      });
  });
};

Post.getPostById = (data) => {
  return new Promise((resolve, reject) => {
    if (!helper.isEmpty(data.columns)) {
      postSchema
        .findById(data.postId)
        .select(data.columns)
        .then((result) => {
          resolve({ err: null, data: result });
        })
        .catch((err) => {
          reject({ err: err, data: null });
        });
    } else {
      postSchema
        .findById(data)
        .then((result) => {
          resolve({ err: null, data: result });
        })
        .catch((err) => {
          reject({ err: err, data: null });
        });
    }
  });
};

Post.updatePost = (postData) => {
  return new Promise((resolve, reject) => {
    let { where, data } = postData;
    postSchema
      .updateOne(where, data)
      .then((result) => {
        resolve({ err: null, data: result });
      })
      .catch((err) => {
        reject({ err: err, data: null });
      });
  });
};

Post.getPostsListByAuthor = (data) => {
  return new Promise((resolve, reject) => {
    
    let where = {
      ...data.where,
      status: {
        $ne: "deleted",
      },
    };
    let order = data.order;
    postSchema
      .find(where)
      .select(data.columns)
      .sort(data.order)
      .exec()
      .then((result) => {
        resolve({ err: null, data: result });
      })
      .catch((err) => {
        reject({ err: err, data: null });
      });
  });
}


Post.getPostById = (data, userId) => {
  return new Promise((resolve, reject) => {
    let where = {
      ...data.where,
    };
    let order = data.order;
    postSchema
      .findOne(where)
      .populate({
        path: "author",
        select: "username profile.name profile.profilePicture",
      })
      .populate({
        path: "likes",
        $elemMatch: !helper.isEmpty(userId) ? { _id: new mongoose.Types.ObjectId(userId) } : {},
        select: "_id",
      })
      .exec()
      .then((result) => {
        resolve({ err: null, data: result });
      })
      .catch((err) => {
        reject({ err: err, data: null });
      });
  });
};


Post.getPostDetailsByPostId = (data) => {
  return new Promise((resolve, reject) => {

    let {postId, userId} = data;

    postSchema.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(postId),
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author"
        }
      },
      {
        $unwind: {
          path: "$author",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "likes",
          foreignField: "_id",
          as: "likes"
        }
      },
      {
        $lookup: {
          from: "comments",
          localField: "comments.postId",
          foreignField: "_id",
          as: "comments"
        }
      },
      {
        $unwind: {
          path: "$comments",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          "author.profile": 1, 
          "author.username": 1,
          "likes.username": 1, 
          "likes._id": 1,
          "likes.profile.name": 1,
          "postContent": 1,
          "files": 1,
        }
      }
    ]).then((result) => {
      if (!helper.isEmpty(result)) {
        resolve({ err: null, data: result[0] });
      } else {
        resolve({ err: null, data: null });
      }
    }).catch((err) => {
      reject({ err: err, data: null });
    });
    
  });
}

module.exports = Post;
