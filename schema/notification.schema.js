const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users', // Reference to the user who will receive the notification
    required: true,
  },
  type: {
    type: String,
    enum: ['follow', 'like', 'comment'], // Notification type (follow, like, or comment)
    required: true,
  },
  actionBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users', // Reference to the user who performed the action (e.g., followed, liked, or commented)
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'posts', // Reference to the post related to the notification (for likes and comments)
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false, // Indicates whether the notification has been read by the user
  },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
