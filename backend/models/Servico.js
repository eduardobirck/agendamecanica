const mongoose = require('mongoose');

const ServicoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'O nome do serviço é obrigatório'],
    trim: true,
  },
  duracao: {
    type: Number, 
    required: [true, 'A duração do serviço é obrigatória'],
    min: 15, 
  },
  preco: {
    type: Number,
    required: false, 
  },
  oficina: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Oficina',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Servico', ServicoSchema);