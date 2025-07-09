const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const verificarLogin = require('../middlewares/verificarLogin');

router.get('/', verificarLogin, async (req, res) => {
  try {
    const posts = await Post.find({ author: { $ne: null } })
      .populate('author')
      .populate('comentarios.autor')
      .sort({ createdAt: -1 });

    res.render('feed', {
      posts,
      usuario: req.session.usuario
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar feed.');
  }
});

module.exports = router;