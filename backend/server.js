const app = require('./app'); 
const connectDB = require('./config/db');

connectDB();

const port = process.env.PORT || 3001;

const server = app.listen(port, () => {
  console.log(`🚀 Servidor backend rodando em http://localhost:${port}`);
});

// Tratamento de erros de promise não capturados
process.on('unhandledRejection', (err, promise) => {
  console.log(`Erro: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = { server }; 