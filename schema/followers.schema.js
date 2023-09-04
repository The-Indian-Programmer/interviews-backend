const mongoose = require('mongoose');

const followerSchema = new mongoose.Schema({
  follower: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  following: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  // Timestamp for when the follow relationship was created
  createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});

const Follower = mongoose.model('followers', followerSchema);

module.exports = Follower;