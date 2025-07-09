const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const Servico = require('../models/Servico');

// @route   POST /api/servicos
// @desc    Admin cria um novo serviço para uma oficina
// @access  Private (Admin)
router.post('/', [protect, authorize('admin')], async (req, res) => {
  const { nome, duracao, preco, oficina } = req.body;
  try {
    const novoServico = new Servico({ nome, duracao, preco, oficina });
    await novoServico.save();
    res.status(201).json(novoServico);
  } catch (error) {
    res.status(400).json({ msg: 'Falha ao criar serviço', error: error.message });
  }
});

// @route   GET /api/servicos
// @desc    Lista serviços de uma oficina específica
// @access  Private (Qualquer usuário logado)
router.get('/', protect, async (req, res) => {
  const { oficinaId } = req.query;
  if (!oficinaId) {
    return res.status(400).json({ msg: 'O ID da oficina é obrigatório.' });
  }
  try {
    const servicos = await Servico.find({ oficina: oficinaId });
    res.json(servicos);
  } catch (error) {
    res.status(500).send('Erro no servidor');
  }
});

// @route   PUT /api/servicos/:id
// @desc    Admin atualiza um serviço
// @access  Private (Admin)
router.put('/:id', [protect, authorize('admin')], async (req, res) => {
  const { nome, duracao, preco } = req.body;
  try {
    const servico = await Servico.findByIdAndUpdate(
      req.params.id,
      { nome, duracao, preco },
      { new: true, runValidators: true }
    );
    if (!servico) {
      return res.status(404).json({ msg: 'Serviço não encontrado' });
    }
    res.json(servico);
  } catch (error) {
    res.status(400).json({ msg: 'Falha ao atualizar serviço', error: error.message });
  }
});


// @route   DELETE /api/servicos/:id
// @desc    Admin deleta um serviço
// @access  Private (Admin)
router.delete('/:id', [protect, authorize('admin')], async (req, res) => {
  try {
    const servico = await Servico.findById(req.params.id);
    if (!servico) {
      return res.status(404).json({ msg: 'Serviço não encontrado' });
    }
    await servico.deleteOne();
    res.json({ msg: 'Serviço removido com sucesso' });
  } catch (error) {
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;