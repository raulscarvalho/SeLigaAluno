const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const multer = require('multer');
const path = require('path');

// Configurar upload das ftos de perfil
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nomeArquivo = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, nomeArquivo);
  }
});

const upload = multer({ storage });

// Página de cadastro
router.get('/', (req, res) => {
  res.render('cadastro', { erro: null });
});

// Cadastro com foto
router.post('/', upload.single('foto'), async (req, res) => {
  const { nome, email, senha, curso } = req.body;
  const foto = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const jaExiste = await Usuario.findOne({ email });
    if (jaExiste) {
      return res.render('cadastro', { erro: 'E-mail já cadastrado' });
    }

    const novoUsuario = new Usuario({ nome, email, senha, curso, foto });
    await novoUsuario.save();

    req.session.usuario = novoUsuario;
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('cadastro', { erro: 'Erro ao cadastrar. Tente novamente.' });
  }
});

module.exports = router;
