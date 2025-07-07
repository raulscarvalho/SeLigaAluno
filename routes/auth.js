const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

// Página de login
router.get('/login', (req, res) => {
  res.render('login', { erro: null });
});

// Autenticação
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.render('login', { erro: 'Usuário não encontrado' });
    }

    const senhaOk = await usuario.compararSenha(senha);

    if (!senhaOk) {
      return res.render('login', { erro: 'Senha incorreta' });
    }

    // OK: login
    req.session.usuario = usuario;
    res.redirect('/');
  } catch (err) {
    console.error('Erro no login:', err);
    res.render('login', { erro: 'Erro interno, tente novamente.' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
