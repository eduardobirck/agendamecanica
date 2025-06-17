// Importações
require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); 
const { protect, authorize } = require('./middleware/authMiddleware');

// Inicialização do App
const app = express();
const port = process.env.PORT || 3001;


app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado ao MongoDB Atlas'))
  .catch((err) => console.error('❌ Erro ao conectar ao MongoDB:', err));



const AgendamentoSchema = new mongoose.Schema({
  data: { type: Date, required: true },
  hora: { type: String, required: true },
  nomeCliente: { type: String, required: true },
  servico: { type: String, required: true },
  veiculo: String,
  placa: { type: String, required: true },
  telefone: String
}, { timestamps: true }); 

const Agendamento = mongoose.model('Agendamento', AgendamentoSchema);



app.get('/api/agendamentos', protect, async (req, res) => {
  try {
    const agendamentos = await Agendamento.find().sort({ data: 1, hora: 1 });
    res.json(agendamentos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar agendamentos', error });
  }
});


app.post('/api/agendamentos', protect, async (req, res) => {
  try {
    const novoAgendamento = new Agendamento(req.body);
    
    const agendamentoSalvo = await novoAgendamento.save();
    
    res.status(201).json(agendamentoSalvo);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar agendamento', error });
  }
});

app.put('/api/agendamentos/:id', protect, async(req,res) => {
  try {
    const { id } = req.params;
    const dadosAtualizados = req.body;
    const agendamentoAtualizado = await Agendamento.findByIdAndUpdate(id, dadosAtualizados, {new: true});

    if (!agendamentoAtualizado){
      return res.status(404).json({message: 'Agendamento não encontrado'});
    }
    
    res.status(200).json(agendamentoAtualizado);
  } catch (error) {
    res.status(400).json({message: 'Erro ao autalizar o agendamento', error});
  }
});


app.delete('/api/agendamentos/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    const agendamentoDeletado = await Agendamento.findByIdAndDelete(id);

    if (!agendamentoDeletado) {
      return res.status(404).json({ message: 'Agendamento não encontrado' });
    }

    res.status(200).json({ message: 'Agendamento deletado com sucesso' });

  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar agendamento', error });
  }
});

app.use('/api/auth', require('./routes/auth'));

app.use('/api/oficinas', require('./routes/oficinas'));

app.listen(port, () => {
  console.log(`🚀 Servidor backend rodando em http://localhost:${port}`);
});