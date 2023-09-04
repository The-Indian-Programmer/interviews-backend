const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    postContent: { type: String, required: true },
    files: { type: Array },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    status: { type: String, enum: ['active', 'inactive', 'deleted'], default: 'active' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comments' }],
}, { timestamps: true });

const Post = mongoose.model('posts', postSchema);

module.exports = Post;