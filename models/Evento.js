const mongoose = require('mongoose');

const EventoSchema = new mongoose.Schema({
  titulo: String,
  descricao: String,
  data: Date,
  local: String,
  imagem: {
    data: Buffer,
    contentType: String
  },
  inscritos: {
    type: Number,
    default: 0
  }
});
module.exports = mongoose.model('Evento', EventoSchema);
