const express = require('express');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Registrar um novo usuário
// @access  Public
router.post(
  '/register',
  [ // Validação de Entradas
    check('name', 'O nome é obrigatório').not().isEmpty(),
    check('email', 'Por favor, inclua um email válido').isEmail(),
    check('password', 'A senha deve ter 6 ou mais caracteres').isLength({ min: 6 }),
  ],
  async (req, res) => {
    // Tratamento de Erros de Validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ errors: [{ msg: 'Usuário já existe' }] });
      }

      user = new User({ name, email, password, role });
      await user.save();

      res.status(201).json({ msg: 'Usuário registrado com sucesso' });

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erro no servidor');
    }
  }
);

// @route   POST /api/auth/login
// @desc    Autenticar usuário e obter token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Por favor, inclua um email válido').isEmail(),
    check('password', 'A senha é obrigatória').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email }).select('+password');

      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Credenciais inválidas' }] });
      }

      const isMatch = await user.matchPassword(password);

      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Credenciais inválidas' }] });
      }

      // Cria o payload do token
      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '5h' }, // Token expira em 5 horas
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erro no servidor');
    }
  }
);

module.exports = router;