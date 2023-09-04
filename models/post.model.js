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
module.exports = Post;
