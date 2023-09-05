const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    comment: { type: String, required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'posts' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    status: { type: String, enum: ['active', 'inactive', 'deleted'], default: 'active' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, {
    timestamps: true
});

const Comment = mongoose.model('comments', commentSchema);

module.exports = Comment;