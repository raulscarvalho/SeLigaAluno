const mongoose = require('mongoose');

const ComentarioSchema = new mongoose.Schema({
  autor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  texto: String,
  criadoEm: { type: Date, default: Date.now }
});

const PostSchema = new mongoose.Schema({
  message: String,
  title: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  createdAt: { type: Date, default: Date.now },

  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }],      
  comentarios: [ComentarioSchema],                                       
  salvosPor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }]  
});

module.exports = mongoose.model("Post", PostSchema);
