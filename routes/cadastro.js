const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

// Página de cadastro
router.get('/', (req, res) => {
  res.render('cadastro', { erro: null });
});

// Cadastro do usuário
router.post('/', async (req, res) => {
  const { nome, email, senha, curso } = req.body;

  try {
    const jaExiste = await Usuario.findOne({ email });
    if (jaExiste) {
      return res.render('cadastro', { erro: 'E-mail já cadastrado' });
    }

    const novoUsuario = new Usuario({ nome, email, senha, curso });
    await novoUsuario.save();
    req.session.usuario = novoUsuario;
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('cadastro', { erro: 'Erro ao cadastrar. Tente novamente.' });
  }
});

module.exports = router;
