const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const verificarLogin = require('../middlewares/verificarLogin');

function objetoIdIgual(id1, id2) {
  return id1.toString() === id2.toString();
}

router.post('/criar', verificarLogin, async (req, res) => {
  try {
    const { message, title } = req.body;
    const novoPost = new Post({
      message,
      title,
      author: req.session.usuario._id
    });
    await novoPost.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Erro ao criar post.' });
  }
});

router.post('/:id/like', verificarLogin, async (req, res) => {
  try {
    const usuarioId = req.session.usuario._id;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, error: 'Post não encontrado' });

    const idx = post.likes.findIndex(id => objetoIdIgual(id, usuarioId));
    if (idx === -1) {
      post.likes.push(usuarioId);
    } else {
      post.likes.splice(idx, 1);
    }

    await post.save();
    res.json({ success: true, likesCount: post.likes.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/:id/comentar', verificarLogin, async (req, res) => {
  try {
    const usuarioId = req.session.usuario._id;
    const { texto } = req.body;

    if (!texto || texto.trim() === '') {
      return res.status(400).json({ success: false, error: 'Comentário vazio' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, error: 'Post não encontrado' });

    post.comentarios.push({ autor: usuarioId, texto: texto.trim() });
    await post.save();

    res.json({ success: true, comentarios: post.comentarios });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/:id/salvar', verificarLogin, async (req, res) => {
  try {
    const usuarioId = req.session.usuario._id;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, error: 'Post não encontrado' });

    const idx = post.salvosPor.findIndex(id => objetoIdIgual(id, usuarioId));
    if (idx === -1) {
      post.salvosPor.push(usuarioId);
    } else {
      post.salvosPor.splice(idx, 1);
    }

    await post.save();
    res.json({ success: true, salvosCount: post.salvosPor.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;