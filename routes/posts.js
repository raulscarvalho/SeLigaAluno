const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const verificarLogin = require('../middlewares/verificarLogin');

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

router.post('/posts/:id/like', async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;

  try {
    const post = await Post.findById(postId);

    const index = post.likes.indexOf(userId);
    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();
    res.json({ success: true, likesCount: post.likes.length });
  } catch (error) {
    res.json({ success: false });
  }
});


router.post('/posts/:id/comentar', async (req, res) => {
  const postId = req.params.id;
  const texto = req.body.texto;
  const userId = req.user._id;

  try {
    const post = await Post.findById(postId).populate('comentarios.autor');
    post.comentarios.push({ texto, autor: userId });
    await post.save();
    await post.populate('comentarios.autor');

    res.json({ success: true, comentarios: post.comentarios });
  } catch (error) {
    res.json({ success: false });
  }
});

router.post('/posts/:id/salvar', async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;

  try {
    const post = await Post.findById(postId);
    const index = post.salvosPor.indexOf(userId);
    if (index === -1) {
      post.salvosPor.push(userId);
    } else {
      post.salvosPor.splice(index, 1);
    }

    await post.save();
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false });
  }
});


module.exports = router;