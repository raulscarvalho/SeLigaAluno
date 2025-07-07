const mongoose = require('mongoose');

const AlmocoSchema = new mongoose.Schema({
  diaSemana: {
    type: String,
    enum: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta']
  },
  pratoPrincipal: String,
  bebida: String,
  sobremesa: String
});

module.exports = mongoose.model("Almoco", AlmocoSchema);