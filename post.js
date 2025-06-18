const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    author: String,
    title: String,
    message: String
});

module.exports = mongoose.model("Post", PostSchema);
