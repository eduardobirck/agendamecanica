const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); 
const Agendamento = require('../models/Agendamento');
const Oficina = require('../models/Oficina');

// @route   POST /api/agendamentos
// @desc    Criar um novo agendamento para uma oficina específica
// @access  Private (Qualquer usuário logado)
router.post('/', protect, async (req, res) => {
  // Garanta que esta linha esteja exatamente assim, incluindo 'oficina' no final
  const { data, hora, nomeCliente, servico, veiculo, placa, telefone, oficina } = req.body;

  try {
    const oficinaExiste = await Oficina.findById(oficina);
    if (!oficinaExiste) {
      return res.status(404).json({ msg: 'Oficina não encontrada' });
    }

    if (!data || !hora || !nomeCliente || !servico || !placa) {
      return res.status(400).json({ msg: 'Por favor, preencha todos os campos obrigatórios.' });
    }

    const novoAgendamento = new Agendamento({
      oficina, // Forma curta de 'oficina: oficina'
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
// @desc    Listar agendamentos (para admins ou de uma oficina específica para clientes)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { oficinaId } = req.query;
    
    let filtro = {}; 
    if (req.user.role !== 'admin') {
      if (!oficinaId) {
        return res.status(400).json({ msg: 'O ID da oficina é obrigatório para clientes.' });
      }
      filtro.oficina = oficinaId;
    } else {
      if (oficinaId) {
        filtro.oficina = oficinaId;
      }
    }

    const agendamentos = await Agendamento.find(filtro)
      .populate('oficina', 'nome') 
      .sort({ data: 1, hora: 1 });

    res.json(agendamentos);

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Erro no servidor');
  }
});


module.exports = router;