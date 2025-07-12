require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// --- ROTAS DA API ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/oficinas', require('./routes/oficinas'));
app.use('/api/agendamentos', require('./routes/agendamentos'));
app.use('/api/users', require('./routes/users'));
app.use('/api/servicos', require('./routes/servicos'));

module.exports = app;