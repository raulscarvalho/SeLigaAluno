const mongoose = require('mongoose');

const EventoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descricao: { type: String, required: true },
  data: { type: Date, required: true },
  local: { type: String, required: true },
  criadoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Evento', EventoSchema);
