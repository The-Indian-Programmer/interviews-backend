
const events = require('events');

const NotificationEvents = new events.EventEmitter();
const UserController = require('../controllers/user.controller.js');
const PostController = require('../controllers/post.controller.js');
const NotificatationController = require('../controllers/notification.controller.js');

/* Follow/Unfollow User */
NotificationEvents.on('followed-user', (data) => {
    NotificatationController.addFollowNotification(data);
});

NotificationEvents.on('unfollowed-user', (data) => {
    NotificatationController.addUnFollowNotification(data);
});


/* Like, Comment on Post */
NotificationEvents.on('liked-post', (data) => {
    NotificatationController.addLikedPostNotification(data);
});

NotificationEvents.on('unliked-post', (data) => {
    NotificatationController.addUnLikePostNotification(data);
});

NotificationEvents.on('commented-post', (data) => {
    NotificatationController.commentedPost(data);
});


module.exports = NotificationEvents;