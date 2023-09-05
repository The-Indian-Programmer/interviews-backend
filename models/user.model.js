const userSchema = require("../schema/users.schema");
const FollowSchema = require("../schema/followers.schema");
let User = {};

User.createUser = (data) => {
    return new Promise((resolve, reject) => {
        const user = new userSchema(data);
        user
            .save()
            .then((result) => {
                console.log(result);
                resolve(result);
            })
            .catch((err) => {
                console.log(err);
                reject(err);
            });
    });
};

User.getAllUser = (data) => {
    return new Promise((resolve, reject) => {
        userSchema.find(data, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

User.getUserById = (data) => {
    return new Promise((resolve, reject) => {
        userSchema.findById(data, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

User.updateUser = (where, data) => {
    return new Promise((resolve, reject) => {
        userSchema
            .updateOne(where, data)
            .then((result) => {
                resolve({ err: null, data: result });
            })
            .catch((err) => {
                reject({ err: err, data: null });
            });
    });
};

User.getUserByToken = (data) => {
    return new Promise((resolve, reject) => {
        userSchema.find(
            { tokens: { $elemMatch: { token: data } } },
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }
        );
    });
};

User.getUser = (where) => {
    return new Promise((resolve, reject) => {
        let isUserExists = userSchema.findOne(where);
        resolve(isUserExists);
    });
};

User.getUserOnlyDetail = (where, columns) => {
    return new Promise((resolve, reject) => {
        let isUserExists = userSchema.findOne(where, columns);
        resolve(isUserExists);
    });
};

User.updateFollowStatus = (where, data) => {
    return new Promise((resolve, reject) => {
        const follow = new FollowSchema(data);
        follow.save().then((result) => {
            resolve({ err: null, data: result });
        }).catch((err) => {
            reject({ err: err, data: null });
        });
    });
};

User.unFollowUser = (where, data) => {
    return new Promise((resolve, reject) => {
        FollowSchema.findOneAndDelete(where).then(() => {
            resolve({ err: null, data: true });
        }).catch((error) => {
            reject({ err: error, data: null });
        });
    });
};

User.getFollowers = (where) => {
    return new Promise((resolve, reject) => {
        FollowSchema.countDocuments(where).then((result) => {
            resolve({ err: null, data: result });
        }).catch((error) => {
            reject({ err: error, data: null });
        });
    });
}

User.getDetails = (where, columns) => {
    return new Promise(async (resolve, reject) => {
        userSchema.findById(where, columns).then((result) => {
            resolve({ err: null, data: result });
        }).catch((error) => {
            reject({ err: error, data: null });
        });
    });
}

User.getUsersList = (data, userId) => {
    return new Promise((resolve, reject) => {

        let limit = data.limit;
        let skip = data.offset;
        let where = {
            ...data.where,
            status: {
                $ne: "deleted",
            },
        };

        if (!helper.isEmpty(userId)) {
            where._id = {
                $ne: userId,
            };
        }

        let order = data.order;
        let columns = ["_id", "username", "email", "profile", "createdAt"];

        userSchema.find(where, columns).sort(order).skip(skip).limit(limit).then((result) => {
            resolve({ err: null, data: result });
        }).catch((error) => {
            reject({ err: error, data: null });
        });
    });

}

User.getUsersCount = (data) => {
    return new Promise((resolve, reject) => {

        let where = {
            ...data.where,
            status: {
                $ne: "deleted",
            },
        };
        userSchema.countDocuments(where).then((result) => {
            resolve({ err: null, data: result });
        }).catch((error) => {
            reject({ err: error, data: null });
        });
    });

}
module.exports = User;
