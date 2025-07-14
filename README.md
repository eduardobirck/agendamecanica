# ⚙️ Agenda de Oficina Mecânica - Plataforma de Agendamento

## 📋 Sobre o Projeto

Este projeto é uma plataforma web full-stack completa para o agendamento de serviços em oficinas mecânicas. Desenvolvido como um projeto acadêmico, o sistema vai além de uma simples agenda, implementando um modelo multi-tenant onde múltiplas oficinas podem ser cadastradas e gerenciadas, cada uma com seus próprios serviços, horários e agendamentos.

A aplicação conta com um sistema de autenticação e autorização robusto, com diferentes níveis de acesso para Clientes, Donos de Oficina e Administradores do sistema, garantindo uma arquitetura segura e escalável.

---

## ✨ Funcionalidades Principais

* **Sistema de Autenticação Completo:** Registro de novos usuários e login seguro com tokens **JWT** e senhas criptografadas com **bcrypt**.
* **Múltiplos Papéis de Usuário:**
    * **Cliente:** Pode ver as oficinas, escolher serviços e agendar horários disponíveis.
    * **Dono de Oficina:** (Estrutura pronta) Pode gerenciar os dados da sua própria oficina.
    * **Admin:** Tem acesso total ao sistema, podendo gerenciar usuários, oficinas e serviços.
* **Gerenciamento de Oficinas (CRUD):** O admin pode criar, listar, editar e deletar oficinas na plataforma.
* **Gerenciamento de Usuários (CRUD):** O admin pode gerenciar todos os usuários, alterar seus papéis, status (ativo/inativo) e senhas.
* **Gerenciamento de Serviços (CRUD):** Cada oficina pode ter seus próprios serviços com nome, preço e **duração variável**.
* **Sistema de Agendamento Inteligente:**
    * O cliente seleciona um serviço com duração específica.
    * O sistema calcula e exibe **apenas os horários disponíveis**, considerando o horário de funcionamento da oficina, a duração do serviço e os agendamentos já existentes para evitar colisões.
* **Documentação de API Interativa:** API documentada com **Swagger (OpenAPI)**, permitindo fácil visualização e teste de todos os endpoints.
* **Testes Unitários/Integração (Backend):** Estrutura de testes com **Jest** e **Supertest** para garantir a confiabilidade e o correto funcionamento da API.

---

## 💻 Tecnologias Utilizadas

Este projeto foi construído com tecnologias modernas e amplamente utilizadas no mercado.

#### **Backend**
* **Node.js:** Ambiente de execução JavaScript no servidor.
* **Express.js:** Framework para a construção da API RESTful.
* **MongoDB:** Banco de dados NoSQL para armazenamento de dados.
* **Mongoose:** ODM para modelagem dos dados e interação com o MongoDB.
* **JSON Web Token (JWT):** Para autenticação e gerenciamento de sessões.
* **Bcrypt.js:** Para criptografia segura de senhas.
* **Express-validator:** Para validação de dados nas rotas da API.

#### **Frontend**
* **React.js:** Biblioteca para construção da interface de usuário.
* **Material-UI (MUI):** Biblioteca de componentes para um design profissional e responsivo.
* **React Router:** Para gerenciamento de rotas e navegação na aplicação (SPA).
* **Axios:** Cliente HTTP para comunicação com a API do backend.
* **React Context API:** Para gerenciamento do estado global de autenticação.

#### **Testes e Documentação**
* **Jest & Supertest:** Para os testes de integração da API.
* **Swagger (OpenAPI):** Para a documentação interativa da API.

---

## 🚀 Instalação e Execução

Para executar este projeto localmente, siga os passos abaixo.

### **Pré-requisitos**

* [Node.js](https://nodejs.org/en/) (versão 16 ou superior)
* [npm](https://www.npmjs.com/) (geralmente instalado com o Node.js)
* [Git](https://git-scm.com/)

### **1. Clonar o Repositório**

```bash
git clone https://github.com/eduardobirck/agendamecanica.git
cd nome-da-pasta-do-projeto