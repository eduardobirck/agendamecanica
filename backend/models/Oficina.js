const mongoose = require('mongoose');

const OficinaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'O nome da oficina é obrigatório'],
    trim: true, 
  },
  cnpj: {
    type: String,
    required: [true, 'O CNPJ é obrigatório'],
    unique: true, 
  },
  endereco: {
    rua: { type: String, required: true },
    numero: { type: String },
    cidade: { type: String, required: true },
    estado: { type: String, required: true },
    cep: { type: String, required: true },
  },
  telefone: {
    type: String,
    required: [true, 'O telefone é obrigatório'],
  },
  proprietario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  horarioInicio: {
    type: String, 
    default: '08:00',
  },
  horarioFim: {
    type: String,
    default: '18:00',
  },

  atendimentosSimultaneos: {
    type: Number,
    default: 1, 
    min: 1,     
  },
  
}, { timestamps: true });

module.exports = mongoose.model('Oficina', OficinaSchema);