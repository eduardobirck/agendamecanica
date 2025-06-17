const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Importa nossos middlewares de segurança e o modelo Oficina
const { protect, authorize } = require('../middleware/authMiddleware');
const Oficina = require('../models/Oficina');

// @route   POST /api/oficinas
// @desc    Cadastrar uma nova oficina
// @access  Private (Admin)
router.post(
  '/',
  [
    protect, 
    authorize('admin'), 
    check('nome', 'O nome da oficina é obrigatório').not().isEmpty(),
    check('cnpj', 'O CNPJ é obrigatório').not().isEmpty(),
    check('telefone', 'O telefone é obrigatório').not().isEmpty(),
    check('endereco.rua', 'A rua é obrigatória').not().isEmpty(),
    check('endereco.cidade', 'A cidade é obrigatória').not().isEmpty(),
    check('endereco.estado', 'O estado é obrigatório').not().isEmpty(),
    check('endereco.cep', 'O CEP é obrigatório').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { nome, cnpj, endereco, telefone } = req.body;

      const dadosDaOficina = {
        nome,
        cnpj,
        endereco,
        telefone,
        proprietario: req.user.id, 
      };
      
      const novaOficina = new Oficina(dadosDaOficina);
      await novaOficina.save();

      res.status(201).json(novaOficina);

    } catch (error) {
      console.error(error.message);
      if (error.code === 11000) {
        return res.status(400).json({ errors: [{ msg: 'Este CNPJ já está cadastrado.' }] });
      }
      res.status(500).send('Erro no servidor');
    }
  }
);

// @route   GET /api/oficinas
// @desc    Listar todas as oficinas
// @access  Private (Admin)
router.get('/', [protect, authorize('admin')], async (req, res) => {
  try {
    const oficinas = await Oficina.find().populate('proprietario', 'name email');
    res.json(oficinas);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Erro no servidor');
  }
});


module.exports = router;