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



app.use('/api/auth', require('./routes/auth'));

app.use('/api/oficinas', require('./routes/oficinas'));
app.use('/api/agendamentos', require('./routes/agendamentos'));

app.listen(port, () => {
  console.log(`🚀 Servidor backend rodando em http://localhost:${port}`);
});