// const express = require('express');
// const router = express.Router();

// // Middleware que verifica se o usuário está logado
// function verificarLogin(req, res, next) {
//   if (req.session && req.session.usuario) {
//     next();
//   } else {
//     res.redirect('/login');
//   }
// }

// // Página de perfil do usuário logado
// router.get('/', verificarLogin, (req, res) => {
//   res.render('perfil', { usuario: req.session.usuario });
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Post = require('../models/Post'); // ajuste o caminho se necessário

function verificarLogin(req, res, next) {
  if (req.session && req.session.usuario) {
    next();
  } else {
    res.redirect('/login');
  }
}

router.get('/', verificarLogin, async (req, res) => {
  try {
    const usuarioId = req.session.usuario._id;
    const posts = await Post.find({ author: usuarioId }).populate('author');
    
    res.render('perfil', { usuario: req.session.usuario, posts });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar perfil');
  }
});

module.exports = router;