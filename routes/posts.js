const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const verificarLogin = require('../middlewares/verificarLogin');

// Criar novo post
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

// Editar post
router.put('/:id/editar', verificarLogin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post não encontrado' });

    if (post.author.toString() !== req.session.usuario._id.toString()) {
      return res.status(403).json({ success: false, message: 'Sem permissão para editar este post.' });
    }

    post.message = req.body.message;
    await post.save();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// Deletar post
router.delete('/:id', verificarLogin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post não encontrado' });

    if (post.author.toString() !== req.session.usuario._id.toString()) {
      return res.status(403).json({ success: false, message: 'Sem permissão para excluir este post.' });
    }

    await post.deleteOne();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
