const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

const User = require('../models/User');
const Oficina = require('../models/Oficina');

// @route   GET /api/users
// @desc    Listar todos os usuários (para o admin)
// @access  Private (Admin)
router.get('/', [protect, authorize('admin')], async (req, res) => {
  try {
    // Busca todos os usuários, mas não retorna suas senhas
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).send('Erro no servidor');
  }
});

// @route   POST /api/users
// @desc    Admin cria um novo usuário
// @access  Private (Admin)
router.post('/', [protect, authorize('admin')], async (req, res) => {
  const { name, email, password, role, oficina } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Usuário já existe' });
    }

    const userData = {
      name,
      email,
      password,
      role,
    };

    if (oficina) {
      userData.oficina = oficina;
    }

    // Cria o novo usuário com os dados filtrados
    user = new User(userData);
    
    await user.save();
    res.status(201).json({ msg: 'Usuário criado com sucesso' });

  } catch (error) {
    console.error('ERRO NO CADASTRO DE USUÁRIO:', error.message);
    res.status(500).send('Erro no servidor');
  }
});

// @route   PUT /api/users/:id
// @desc    Admin atualiza um usuário (nome, email, papel, status, oficina)
// @access  Private (Admin)
router.put('/:id', [protect, authorize('admin')], async (req, res) => {
  const { name, email, role, status, oficina } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    user.status = status || user.status;
    user.oficina = oficina || user.oficina;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).send('Erro no servidor');
  }
});


// @route   PUT /api/users/:id/change-password
// @desc    Admin troca a senha de um usuário
// @access  Private (Admin)
router.put('/:id/change-password', [protect, authorize('admin')], async (req, res) => {
  const { password } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }

    user.password = password;
    await user.save();

    res.json({ msg: 'Senha alterada com sucesso' });
  } catch (error) {
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;