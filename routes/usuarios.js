const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const Post = require('../models/Post'); // importe o modelo Post

router.get('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).send('Usuário não encontrado');

    // Busca posts desse usuário, ordenados do mais recente para o mais antigo
    const posts = await Post.find({ author: usuario._id }).sort({ createdAt: -1 });

    // Usuário logado vindo da sessão
    const usuarioLogado = req.session.usuario || null;

    res.render('perfil', { usuario, posts, usuarioLogado });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar perfil do usuário');
  }
});

module.exports = router;
