const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Usuario = require('../models/Usuario');

// Middleware para proteger rotas (login obrigatório)
function verificarLogin(req, res, next) {
  if (!req.session.usuario) return res.status(401).json({ error: 'Usuário não autenticado' });
  next();
}

// Criação de novo post - protegido por login
router.post('/criar', verificarLogin, async (req, res) => {
  const { message } = req.body;
  const usuarioId = req.session.usuario._id;

  try {
    const post = new Post({
      author: usuarioId,
      message: message,
      title: '' 
    });

    await post.save();
    res.status(200).json({ success: true, post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

