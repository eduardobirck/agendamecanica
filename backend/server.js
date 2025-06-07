// Importações
require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); 

// Inicialização do App
const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado ao MongoDB Atlas'))
  .catch((err) => console.error('❌ Erro ao conectar ao MongoDB:', err));


// O Schema define a estrutura dos documentos dentro de uma collection no MongoDB.
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


// ROTA GET: Para buscar/listar todos os agendamentos do banco de dados
app.get('/api/agendamentos', async (req, res) => {
  try {
    const agendamentos = await Agendamento.find().sort({ data: 1, hora: 1 });
    res.json(agendamentos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar agendamentos', error });
  }
});

// ROTA POST: Para criar um novo agendamento no banco de dados
app.post('/api/agendamentos', async (req, res) => {
  try {
    const novoAgendamento = new Agendamento(req.body);
    
    const agendamentoSalvo = await novoAgendamento.save();
    
    res.status(201).json(agendamentoSalvo);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar agendamento', error });
  }
});

app.put('/api/agendamentos/:id', async(req,res) => {
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

// ROTA DELETE: Para deletar um agendamento pelo seu ID
app.delete('/api/agendamentos/:id', async (req, res) => {
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

app.listen(port, () => {
  console.log(`🚀 Servidor backend rodando em http://localhost:${port}`);
});