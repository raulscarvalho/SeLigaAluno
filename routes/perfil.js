const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Usuario = require('../models/Usuario'); 
const multer = require('multer');
const path = require('path');

// Middleware para verificar se o usuário está logado
function verificarLogin(req, res, next) {
  if (req.session && req.session.usuario) {
    next();
  } else {
    res.redirect('/login');
  }
}


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads')); 
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const nomeArquivo = Date.now() + ext;
    cb(null, nomeArquivo);
  }
});
const upload = multer({ storage });

router.get('/', verificarLogin, async (req, res) => {
  try {
    const usuarioId = req.session.usuario._id;

    const posts = await Post.find({ author: usuarioId }).populate('author').sort({ createdAt: -1 });

    const usuarioAtualizado = await Usuario.findById(usuarioId);

    res.render('perfil', { usuario: usuarioAtualizado, posts });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar perfil');
  }
});

router.post('/editar', verificarLogin, upload.single('foto'), async (req, res) => {
  try {
    const { nome } = req.body;
    const usuario = await Usuario.findById(req.session.usuario._id);

    if (!usuario) {
      return res.status(404).send('Usuário não encontrado');
    }

    usuario.nome = nome;

    if (req.file) {
      usuario.foto = req.file.filename;
    }

    await usuario.save();

    req.session.usuario = usuario;

    res.redirect('/perfil');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar perfil');
  }
});

module.exports = router;
