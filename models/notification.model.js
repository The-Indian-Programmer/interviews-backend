const notificationSchema = require("../schema/notification.schema.js");


let notificationModel = {}


notificationModel.addNotification = async (data) => {
    return new Promise((resolve, reject) => {
        const notificationData = new notificationSchema(data);
        notificationData.save().then((result) => {
            resolve({err: null, result: result})
        }).catch((err) => {
            reject({err: err, result: null})
        });
    });
    
};

notificationModel.getNotification = async (data) => {
    return new Promise((resolve, reject) => {
        notificationSchema.find(data.where, data.columns).then((result) => {
            resolve({err: null, result: result})
        }).catch((err) => {
            reject({err: err, result: null})
        });
    });
    
}

notificationModel.deleteNotification = async (id) => {
    return new Promise((resolve, reject) => {
        notificationSchema.findByIdAndDelete(id).then((result) => {
            resolve({err: null, result: result})
        }).catch((err) => {
            reject({err: err, result: null})
        });
    });
    
}


notificationModel.deleteAllNotifications = async (data) => {
    return new Promise((resolve, reject) => {
        notificationSchema.deleteMany(data.where).then((result) => {
            resolve({err: null, result: result})
        }).catch((err) => {
            reject({err: err, result: null})
        });
    });
    
}

notificationModel.getNotificationsList = (data) => {
    return new Promise((resolve, reject) => {
        let where = {
            ...data.where,
        };

        notificationSchema.aggregate([
            {
                $match: where,
            },
            {
                $lookup: {
                    from: "users",
                    localField: "actionBy",
                    foreignField: "_id",
                    as: "actionBy",
                }
            },
            {
                $unwind: {
                    path: "$actionBy",
                    preserveNullAndEmptyArrays: true,
                }
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "post",
                    foreignField: "_id",
                    as: "post",
                }
            },
            {
                $unwind: {
                    path: "$post",
                    preserveNullAndEmptyArrays: true,
                }
            },
            {
                $project: {
                    _id: 1,
                    type: 1,
                    actionBy: {
                        _id: 1,
                        name: 1,
                        profile: {
                            name: 1,
                            profilePicture: 1,
                        },
                    },
                    post: {
                        _id: 1,
                    },
                    createdAt: 1,
                    read: 1,
                }
            },
            {
                $sort: {
                    read: 1,
                    createdAt: -1,
                },
            }, {
                $skip: data.skip,
            }, {
                $limit: data.limit,
            }, 
        ]).then((result) => {
            resolve({err: null, data: result})
        }).catch((err) => {
            reject({err: err, data: null})
        });
    });
}

notificationModel.updateNotification = (data) => {
    return new Promise((resolve, reject) => {
        notificationSchema.updateOne(data.where, data.data).then((result) => {
            resolve({err: null, data: result})
        }).catch((err) => {
            reject({err: err, data: null})
        });
    });
}

notificationModel.getNotificationCount = (data) => {
    return new Promise((resolve, reject) => {
        notificationSchema.countDocuments(data).then((result) => {
            resolve({err: null, data: result})
        }).catch((err) => {
            reject({err: err, data: null})
        });
    });
}

module.exports = notificationModel;