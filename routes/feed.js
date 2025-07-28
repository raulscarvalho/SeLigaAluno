const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const verificarLogin = require('../middlewares/verificarLogin');
const Usuario = require('../models/Usuario');

router.get('/', verificarLogin, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.session.usuario._id);
    const posts = await Post.find({ author: { $ne: null } })
      .populate('author')
      .populate('comentarios.autor')
      .sort({ createdAt: -1 });

    res.render('feed', {
      posts,
      usuario
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar feed.');
  }
});

module.exports = router;