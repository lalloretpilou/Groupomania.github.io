const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: false },
    likes: { type: Number, required: true },
    usersLiked: { type: [String], required: true },
    createdAt: { type: Number, required: true }
});

module.exports = mongoose.model('Post', postSchema);