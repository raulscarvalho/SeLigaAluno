const express = require('express');
const router = express.Router();
const multer = require('multer');
const Post = require('../models/Post');
const Usuario = require('../models/Usuario');
const verificarLogin = require('../middlewares/verificarLogin');

// Configuração do multer para armazenar em memória
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', verificarLogin, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.session.usuario._id);
    const posts = await Post.find({ author: usuario._id }).sort({ createdAt: -1 });
    res.render('perfil', { usuario, posts, usuarioLogado: req.session.usuario });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar perfil');
  }
});

router.get('/editar', verificarLogin, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.session.usuario._id);
    res.render('editarPerfil', { usuario });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar edição de perfil');
  }
});

router.post('/editar', verificarLogin, upload.single('foto'), async (req, res) => {
  try {
    const { nome } = req.body;
    const atualizacoes = { nome };

    if (req.file) {
      atualizacoes.foto = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    await Usuario.findByIdAndUpdate(req.session.usuario._id, atualizacoes);
    res.redirect('/perfil');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar perfil');
  }
});

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
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post não encontrado' });

    const userId = req.session.usuario._id.toString();

    const index = post.likes.findIndex(id => id.toString() === userId);
    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();
    res.json({ success: true, likesCount: post.likes.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

router.post('/:id/comentar', verificarLogin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('comentarios.autor');
    if (!post) return res.status(404).json({ success: false, message: 'Post não encontrado' });

    const novoComentario = {
      texto: req.body.texto,
      autor: req.session.usuario._id
    };

    post.comentarios.push(novoComentario);
    await post.save();
    await post.populate('comentarios.autor');

    res.json({
      success: true,
      comentarios: post.comentarios.map(c => ({
        texto: c.texto,
        autor: { nome: c.autor?.nome || 'Anônimo' }
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

router.post('/:id/salvar', verificarLogin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post não encontrado' });

    const userId = req.session.usuario._id.toString();

    const index = post.salvosPor.findIndex(id => id.toString() === userId);
    if (index === -1) {
      post.salvosPor.push(userId);
    } else {
      post.salvosPor.splice(index, 1);
    }

    await post.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;