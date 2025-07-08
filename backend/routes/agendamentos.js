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

// @route   GET /api/agendamentos/disponibilidade
// @desc    Verificar horários disponíveis para uma oficina em uma data específica
// @access  Private (Qualquer usuário logado)
router.get('/disponibilidade', protect, async (req, res) => {
  const { oficinaId, data } = req.query;

  if (!oficinaId || !data) {
    return res.status(400).json({ msg: 'ID da oficina e data são obrigatórios.' });
  }

  try {
    // 1. Buscar os detalhes da oficina para obter os horários e a capacidade
    const oficina = await Oficina.findById(oficinaId);
    if (!oficina) {
      return res.status(404).json({ msg: 'Oficina não encontrada.' });
    }

    // 2. Buscar TODOS os agendamentos já existentes para essa oficina e data
    const dataSelecionada = new Date(data);
    const inicioDoDia = new Date(dataSelecionada.setUTCHours(0, 0, 0, 0));
    const fimDoDia = new Date(dataSelecionada.setUTCHours(23, 59, 59, 999));
    
    const agendamentosExistentes = await Agendamento.find({
      oficina: oficinaId,
      data: {
        $gte: inicioDoDia,
        $lte: fimDoDia,
      },
    });

    // 3. Gerar todos os possíveis horários de atendimento do dia
    const { horarioInicio, horarioFim, atendimentosSimultaneos } = oficina;
    const [inicioHora, inicioMinuto] = horarioInicio.split(':').map(Number);
    const [fimHora, fimMinuto] = horarioFim.split(':').map(Number);
    
    const todosOsHorarios = [];
    for (let hora = inicioHora; hora < fimHora; hora++) {
      // Por enquanto, estamos considerando apenas slots de 1 hora.
      const horario = `${String(hora).padStart(2, '0')}:00`;
      todosOsHorarios.push(horario);
    }
    
    // 4. Calcular a ocupação de cada horário
    const contagemDeAgendamentos = {};
    agendamentosExistentes.forEach(ag => {
      contagemDeAgendamentos[ag.hora] = (contagemDeAgendamentos[ag.hora] || 0) + 1;
    });

    // 5. Filtrar e retornar apenas os horários que ainda têm vagas
    const horariosDisponiveis = todosOsHorarios.filter(horario => {
      const agendadosNesseHorario = contagemDeAgendamentos[horario] || 0;
      return agendadosNesseHorario < atendimentosSimultaneos;
    });

    res.json(horariosDisponiveis);

  } catch (error) {
    console.error(error);
    res.status(500).send('Erro no servidor');
  }
});


module.exports = router;