const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); 
const Agendamento = require('../models/Agendamento');
const Oficina = require('../models/Oficina');

// @route   POST /api/agendamentos
// @desc    Criar um novo agendamento para uma oficina específica
// @access  Private (Qualquer usuário logado)
router.post('/', protect, async (req, res) => {
  const { data, hora, nomeCliente, servico, veiculo, placa, telefone, oficinaId } = req.body;

  try {
    // Verifica se a oficina para a qual se está agendando realmente existe
    const oficinaExiste = await Oficina.findById(oficinaId);
    if (!oficinaExiste) {
      return res.status(404).json({ msg: 'Oficina não encontrada' });
    }

    if (!data || !hora || !nomeCliente || !servico || !placa) {
      return res.status(400).json({ msg: 'Por favor, preencha todos os campos obrigatórios.' });
    }

    const novoAgendamento = new Agendamento({
      oficina: oficinaId, 
      data,
      hora,
      nomeCliente,
      servico,
      veiculo,
      placa,
      telefone,
    });

    const agendamentoSalvo = await novoAgendamento.save();
    res.status(201).json(agendamentoSalvo);

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Erro no servidor');
  }
});

// @route   GET /api/agendamentos
// @desc    Listar agendamentos de UMA oficina específica
// @access  Private (Qualquer usuário logado pode ver a agenda de uma oficina)
router.get('/', protect, async (req, res) => {
  try {
    // 1. Pegamos o ID da oficina dos parâmetros da URL (query string)
    const { oficinaId } = req.query;

    if (!oficinaId) {
      return res.status(400).json({ msg: 'O ID da oficina é obrigatório' });
    }

    const agendamentos = await Agendamento.find({ oficina: oficinaId }).sort({ data: 1, hora: 1 });

    res.json(agendamentos);

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Erro no servidor');
  }
});



module.exports = router;