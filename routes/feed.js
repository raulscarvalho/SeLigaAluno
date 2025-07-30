const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Usuario = require('../models/Usuario');
const Evento = require('../models/Evento'); // importe o model de eventos
const verificarLogin = require('../middlewares/verificarLogin');

router.get('/', verificarLogin, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.session.usuario._id);

    const posts = await Post.find({ author: { $ne: null } })
      .populate('author')
      .populate('comentarios.autor')
      .sort({ createdAt: -1 });

    const eventos = await Evento.find({ data: { $gte: new Date() } })
      .sort({ data: 1 }) // próximos por ordem de data
      .limit(3); // só os 3 primeiros

    res.render('feed', {
      posts,
      usuario,
      eventos // passe os eventos para a view
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar feed.');
  }
});

module.exports = router;
