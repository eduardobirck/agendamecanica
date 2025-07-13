const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'API da Agenda de Oficina Mecânica',
    version: '1.0.0',
    description: 'Documentação da API para o sistema de agendamento de oficinas. Permite o gerenciamento de usuários, oficinas, serviços e agendamentos com diferentes papéis de acesso.',
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Servidor de Desenvolvimento',
    },
  ],
  // TAGS - Agrupadores de Rotas
  tags: [
    { name: 'Autenticação', description: 'Rotas de registro e login' },
    { name: 'Oficinas', description: 'Operações para visualizar e gerenciar oficinas' },
    { name: 'Serviços', description: 'Operações para gerenciar os serviços de uma oficina' },
    { name: 'Agendamentos', description: 'Operações para criar e visualizar agendamentos' },
    { name: 'Usuários (Admin)', description: 'Operações de administração de usuários' },
  ],
  // COMPONENTS - Schemas e Segurança
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      // Schemas de Usuário
      UserInput: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'João da Silva' },
          email: { type: 'string', example: 'joao@exemplo.com' },
          password: { type: 'string', example: 'senha123' },
          role: { type: 'string', enum: ['user', 'owner', 'funcionario', 'admin'], example: 'user' },
          oficina: { type: 'string', description: "ID da oficina a ser vinculada", example: '6865d8e7c1f8a2a8d5a2b5e4'}
        },
      },
      UserResponse: {
        type: 'object',
        properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' },
            status: { type: 'string' },
            oficina: { type: 'string' },
        }
      },
      // Schemas de Oficina
      OficinaInput: {
        type: 'object',
        properties: {
          nome: { type: 'string', example: 'Mecânica do Zé' },
          cnpj: { type: 'string', example: '12345678000199' },
          telefone: { type: 'string', example: '49999998888' },
          horarioInicio: { type: 'string', example: '08:00' },
          horarioFim: { type: 'string', example: '18:00' },
          atendimentosSimultaneos: { type: 'number', example: 2 },
          endereco: { type: 'object', properties: { rua: { type: 'string' }, cidade: { type: 'string' }, estado: { type: 'string' }, cep: { type: 'string' }}},
        },
      },
    },
  },
  // PATHS - Definição de cada Rota da API
  paths: {
    // --- Rotas de Autenticação ---
    '/api/auth/register': {
      post: {
        tags: ['Autenticação'],
        summary: 'Registra um novo usuário (cliente)',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UserInput' } } } },
        responses: { '201': { description: 'Usuário registrado' }, '400': { description: 'Dados inválidos ou email já existe' } },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Autenticação'],
        summary: 'Autentica um usuário e retorna um token',
        requestBody: { required: true, content: { 'application/json': { schema: { properties: { email: { type: 'string' }, password: { type: 'string' } } } } } },
        responses: { '200': { description: 'Login bem-sucedido' }, '400': { description: 'Credenciais inválidas' }, '403': { description: 'Usuário inativo' } },
      },
    },

    // --- Rotas de Usuários (Admin) ---
    '/api/users': {
      get: {
        tags: ['Usuários (Admin)'],
        summary: 'Lista todos os usuários',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Sucesso', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/UserResponse' } } } } }, '403': { description: 'Acesso proibido' } },
      },
      post: {
        tags: ['Usuários (Admin)'],
        summary: 'Cria um novo usuário',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UserInput' } } } },
        responses: { '201': { description: 'Usuário criado' }, '400': { description: 'Dados inválidos' } },
      },
    },
    '/api/users/{id}': {
      put: {
        tags: ['Usuários (Admin)'],
        summary: 'Atualiza um usuário',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UserInput' } } } },
        responses: { '200': { description: 'Usuário atualizado' }, '404': { description: 'Usuário não encontrado' } },
      },
    },
    '/api/users/{userId}/assign-workshop': {
        put: {
            tags: ['Usuários (Admin)'],
            summary: 'Vincula um usuário a uma oficina como dono',
            security: [{ bearerAuth: [] }],
            parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
            requestBody: { required: true, content: { 'application/json': { schema: { properties: { oficinaId: { type: 'string' } } } } } },
            responses: { '200': { description: 'Usuário vinculado' }, '404': { description: 'Usuário ou oficina não encontrado' } },
        }
    },
    
    // --- Rotas de Oficinas ---
    '/api/oficinas/public': {
      get: {
        tags: ['Oficinas'],
        summary: 'Lista todas as oficinas para o público',
        responses: { '200': { description: 'Sucesso' } },
      },
    },
    '/api/oficinas': {
      post: {
        tags: ['Oficinas'],
        summary: 'Cria uma nova oficina (Admin)',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/OficinaInput' } } } },
        responses: { '201': { description: 'Oficina criada' } },
      },
      get: {
        tags: ['Oficinas'],
        summary: 'Lista todas as oficinas (Admin)',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Sucesso' } },
      }
    },
    '/api/oficinas/{id}': {
      get: {
        tags: ['Oficinas'],
        summary: 'Busca detalhes de uma oficina',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Sucesso' }, '404': { description: 'Oficina não encontrada' } },
      },
      put: {
        tags: ['Oficinas'],
        summary: 'Atualiza uma oficina (Admin)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/OficinaInput' } } } },
        responses: { '200': { description: 'Oficina atualizada' } },
      },
      delete: {
        tags: ['Oficinas'],
        summary: 'Deleta uma oficina (Admin)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Oficina deletada' } },
      }
    },
    // -- Rota de serviços --
    '/api/servicos': {
      post: {
        tags: ['Serviços'],
        summary: 'Cria um novo serviço para uma oficina (Admin)',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ServicoInput' } } } },
        responses: { '201': { description: 'Serviço criado' }, '400': { description: 'Dados inválidos' } }
      },
      get: {
        tags: ['Serviços'],
        summary: 'Lista os serviços de uma oficina específica',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'oficinaId', in: 'query', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Sucesso' } }
      }
    },
    '/api/servicos/{id}': {
      put: {
        tags: ['Serviços'],
        summary: 'Atualiza um serviço (Admin)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ServicoInput' } } } },
        responses: { '200': { description: 'Serviço atualizado' }, '404': { description: 'Serviço não encontrado' } }
      },
      delete: {
        tags: ['Serviços'],
        summary: 'Deleta um serviço (Admin)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Serviço deletado' }, '404': { description: 'Serviço não encontrado' } }
      }
    },
    // --- ROTAS DE AGENDAMENTOS ---
    '/api/agendamentos/disponibilidade': {
      get: {
        tags: ['Agendamentos'],
        summary: 'Verifica horários disponíveis para um serviço em uma data',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'oficinaId', in: 'query', required: true, schema: { type: 'string' } },
          { name: 'data', in: 'query', required: true, schema: { type: 'string', format: 'date' }, example: '2025-12-31' },
          { name: 'servicoId', in: 'query', required: true, schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'Lista de horários disponíveis (ex: ["09:00", "09:15"])' } },
      },
    },
    '/api/agendamentos': {
      get: {
        tags: ['Agendamentos'],
        summary: 'Lista agendamentos (filtrado por oficina para clientes, todos para admins)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'oficinaId', in: 'query', description: 'Obrigatório para clientes, opcional para admins', schema: { type: 'string' } }],
        responses: { '200': { description: 'Sucesso' }, '400': { description: 'ID da oficina obrigatório para clientes' } }
      },
      post: {
        tags: ['Agendamentos'],
        summary: 'Cria um novo agendamento',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/AgendamentoInput' } } } },
        responses: { '201': { description: 'Agendamento criado' }, '400': { description: 'Dados inválidos' } }
      }
    },
    '/api/agendamentos/{id}': {
        delete: {
            tags: ['Agendamentos'],
            summary: 'Deleta um agendamento (Admin ou Dono da Oficina)',
            security: [{ bearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { '200': { description: 'Agendamento deletado' }, '404': { description: 'Agendamento não encontrado' } }
        }
    }
  },
  security: [{ bearerAuth: [] }],
};

module.exports = swaggerDocument;