const express = require('express');
const router = express.Router();
const Evento = require('../models/Evento');

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
router.post('/novo', verificarLogin, async (req, res) => {
  try {
    const { titulo, descricao, data, hora, local } = req.body;
    const dataCompleta = new Date(`${data}T${hora}`);

    const evento = new Evento({ titulo, descricao, data: dataCompleta, local });
    await evento.save();
    res.redirect('/eventos');
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao criar evento");
  }
});


module.exports = router;
