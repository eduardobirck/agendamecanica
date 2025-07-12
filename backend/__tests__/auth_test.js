const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/User');

let mongoServer;
let server;

// ANTES de todos os testes, inicializa o banco de dados em memória
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
  server = app.listen(); 
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  server.close();
});

// ANTES de cada teste, limpa a coleção de usuários
beforeEach(async () => {
  await User.deleteMany({});
});

// Agrupamos os testes de autenticação
describe('Rotas de Autenticação - /api/auth', () => {

  // Teste 1: Deve registrar um novo usuário com sucesso
  it('deve registrar um novo usuário com sucesso', async () => {
    const novoUsuario = {
      name: 'Teste User',
      email: 'teste@exemplo.com',
      password: 'password123',
    };

    // 2 (execução da ação a ser testada)
    const response = await request(app)
      .post('/api/auth/register')
      .send(novoUsuario);

    // 3 (verificação dos resultados)
    expect(response.statusCode).toBe(201);
    expect(response.body.msg).toBe('Usuário registrado com sucesso');

    // Verifica também se o usuário foi realmente salvo no banco
    const userNoDb = await User.findOne({ email: 'teste@exemplo.com' });
    expect(userNoDb).not.toBeNull();
    expect(userNoDb.name).toBe('Teste User');
  });

  // Teste 2: Deve falhar ao registrar um usuário com email já existente
  it('deve retornar erro 400 se o email já existir', async () => {
    const usuarioExistente = new User({
      name: 'Existente User',
      email: 'existente@exemplo.com',
      password: 'password123',
    });
    await usuarioExistente.save();

    // 2 Tentamos registrar de novo com o mesmo email
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Novo User',
        email: 'existente@exemplo.com',
        password: 'password456',
      });
    
    // 3 Verificamos se recebemos o erro esperado
    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].msg).toBe('Usuário já existe');
  });

});