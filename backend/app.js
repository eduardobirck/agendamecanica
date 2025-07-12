require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// --- CONFIGURAÇÃO DO SWAGGER ---
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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