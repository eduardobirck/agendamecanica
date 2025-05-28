const express = require('express');
const app = express();
const port = 3001; // Porta para o backend, diferente da do React

app.get('/', (req, res) => {
  res.send('Olá do Backend!');
});

app.listen(port, () => {
  console.log(`Servidor backend rodando em http://localhost:${port}`);
});


// Middleware para o Express entender JSON no corpo da requisição
app.use(express.json());

app.post('/api/agendamentos', (req, res) => {
  const novoAgendamento = req.body; // Dados enviados pelo frontend
  novoAgendamento.id = proximoId++;
  agendamentos.push(novoAgendamento);
  console.log('Novo agendamento:', novoAgendamento);
  console.log('Todos agendamentos:', agendamentos);
  res.status(201).json(novoAgendamento); // Responde com o agendamento criado
});


app.get('/api/agendamentos', (req, res) => {
  res.json(agendamentos);
});