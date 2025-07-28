const express = require('express');
const router = express.Router();
const Evento = require('../models/Evento');
const multer = require('multer');
const path = require('path');
const storage = multer.memoryStorage(); // importante: armazena em RAM
const upload = multer({ storage: storage });

function verificarLogin(req, res, next) {
  if (!req.session.usuario) return res.redirect('/login');
  next();
}

router.get('/', verificarLogin, async (req, res) => {
  try {
    const eventos = await Evento.find().sort({ data: 1 });
    res.render('eventos/eventos', { eventos, usuario: req.session.usuario });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao carregar eventos");
  }
});

// rota para exibir formulário de novo evento
router.get('/novo', verificarLogin, (req, res) => {
  res.render('eventos/evento_novo', { usuario: req.session.usuario });
});

// rota para salvar novo evento
router.post('/novo', verificarLogin, upload.single('imagem'), async (req, res) => {
  try {
    const { titulo, descricao, data, hora, local } = req.body;
    const dataCompleta = new Date(`${data}T${hora}`);

    const imagem = req.file ? {
      data: req.file.buffer,
      contentType: req.file.mimetype
    } : null;

    const evento = new Evento({
      titulo,
      descricao,
      data: dataCompleta,
      local,
      imagem
    });

    await evento.save();
    res.redirect('/eventos');
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao criar evento");
  }
});

router.delete('/:id', verificarLogin, async (req, res) => {
  try {
    await Evento.findByIdAndDelete(req.params.id);
    res.redirect('/eventos');
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao excluir evento");
  }
});

router.get('/:id', async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id);
    if (!evento) {
      return res.status(404).send('Evento não encontrado');
    }

    res.render('eventos/detalhe', { evento });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar evento');
  }
});

router.post('/:id/inscrever', async (req, res) => {
  try {
    await Evento.findByIdAndUpdate(req.params.id, { $inc: { inscritos: 1 } });
    res.redirect(`/eventos/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao se inscrever no evento");
  }
});

module.exports = router;
