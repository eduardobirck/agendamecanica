const mongoose = require('mongoose');

const AgendamentoSchema = new mongoose.Schema({
  oficina: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Oficina', 
    required: true,
  },
  
  data: { type: Date, required: true },
  hora: { type: String, required: true },
  nomeCliente: { type: String, required: true },
  servico: { type: String, required: true },
  veiculo: String,
  placa: { type: String, required: true },
  telefone: String
}, { timestamps: true });

const Agendamento = mongoose.model('Agendamento', AgendamentoSchema);

module.exports = Agendamento;