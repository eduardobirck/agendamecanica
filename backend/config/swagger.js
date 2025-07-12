const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'API da Agenda de Oficina Mecânica',
    version: '1.0.0',
    description: 'Documentação da API para o sistema de agendamento de oficinas.',
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Servidor de Desenvolvimento',
    },
  ],
  tags: [
    //Descreve as rotas
    {
      name: 'Autenticação',
      description: 'Rotas de registro e login de usuários',
    },
    {
      name: 'Oficinas',
      description: 'Operações para gerenciar as oficinas mecânicas',
    },
  ],
  components: {
    schemas: { 
      UserRegister: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'Eduardo Birck' },
          email: { type: 'string', example: 'eduardo@exemplo.com' },
          password: { type: 'string', example: 'senha123' },
        },
      },
      UserLogin: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'eduardo@exemplo.com' },
          password: { type: 'string', example: 'senha123' },
        },
      },
      Oficina: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'ID único da oficina gerado pelo MongoDB.',
            example: '6865d8e7c1f8a2a8d5a2b5e4',
          },
          nome: {
            type: 'string',
            description: 'Nome da oficina.',
            example: 'Mecânica do Eduardo',
          },
          cnpj: {
            type: 'string',
            description: 'CNPJ da oficina.',
            example: '12.345.678/0001-99',
          },
          proprietario: {
            type: 'string',
            description: 'ID do usuário proprietário da oficina.',
          },   
        }

      },
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Autenticação'],
        summary: 'Registra um novo usuário',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UserRegister',
              },
            },
          },
        },
        responses: {
          '201': { description: 'Usuário registrado com sucesso' },
          '400': { description: 'Email já existe ou dados inválidos' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Autenticação'],
        summary: 'Autentica um usuário e retorna um token JWT',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UserLogin',
              },
            },
          },
        },
        responses: {
          '200': { description: 'Login bem-sucedido, retorna o token' },
          '400': { description: 'Credenciais inválidas' },
          '403': { description: 'Usuário inativo' },
        },
      },
    },
    '/api/oficinas': {
     get: {
        tags: ['Oficinas'],
        summary: 'Lista todas as oficinas',
        description: 'Rota para administradores listarem todas as oficinas cadastradas.',
        security: [{ bearerAuth: [] }], 
        responses: {
          '200': {
            description: 'Lista de oficinas retornada com sucesso.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Oficina',
                  },
                },
              },
            },
          },
          '401': { description: 'Não autorizado (token inválido ou não fornecido)' },
          '403': { description: 'Acesso proibido (usuário não é admin)' },
        },
      },
    },
    '/api/oficinas/{id}': {
      delete: {
        tags: ['Oficinas'],
        summary: 'Deleta uma oficina específica',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'O ID da oficina a ser deletada',
          },
        ],
        responses: {
          '200': { description: 'Oficina removida com sucesso' },
          '404': { description: 'Oficina não encontrada' },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};


module.exports = swaggerDocument;