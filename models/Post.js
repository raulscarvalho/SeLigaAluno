const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  message: String,
  title: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model("Post", PostSchema);
