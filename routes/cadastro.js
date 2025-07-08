const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const multer = require('multer');
const bcrypt = require('bcrypt');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', (req, res) => {
  res.render('cadastro', { erro: null });
});

router.post('/', upload.single('foto'), async (req, res) => {
  const { nome, email, senha, curso } = req.body;

  try {
    const jaExiste = await Usuario.findOne({ email });
    if (jaExiste) {
      return res.render('cadastro', { erro: 'E-mail já cadastrado' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const novoUsuario = new Usuario({
      nome,
      email,
      senha: senhaHash,
      curso
    });

    if (req.file) {
      novoUsuario.foto = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    await novoUsuario.save();
    req.session.usuario = novoUsuario;
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('cadastro', { erro: 'Erro ao cadastrar. Tente novamente.' });
  }
});

module.exports = router;