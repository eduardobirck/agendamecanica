const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); 
const Agendamento = require('../models/Agendamento');
const Oficina = require('../models/Oficina');
const Servico = require('../models/Servico');

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
      .populate('servico', 'nome duracao') 
      .sort({ data: 1, hora: 1 });

    res.json(agendamentos);

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Erro no servidor');
  }
});

// @route   GET /api/agendamentos/disponibilidade
// @desc    Verificar horários disponíveis com base na duração do serviço
// @access  Private
router.get('/disponibilidade', protect, async (req, res) => {
  // Agora recebemos também o ID do serviço
  const { oficinaId, data, servicoId } = req.query;

  if (!oficinaId || !data || !servicoId) {
    return res.status(400).json({ msg: 'ID da oficina, data e serviço são obrigatórios.' });
  }

  try {
    // 1. Buscar detalhes da oficina E do serviço selecionado
    const [oficina, servico] = await Promise.all([
      Oficina.findById(oficinaId),
      Servico.findById(servicoId)
    ]);

    if (!oficina || !servico) {
      return res.status(404).json({ msg: 'Oficina ou Serviço não encontrado.' });
    }

    // 2. Buscar agendamentos existentes para o dia
    const dataSelecionada = new Date(data);
    const inicioDoDia = new Date(dataSelecionada.setUTCHours(0, 0, 0, 0));
    const fimDoDia = new Date(dataSelecionada.setUTCHours(23, 59, 59, 999));
    
    const agendamentosExistentes = await Agendamento.find({
      oficina: oficinaId,
      data: { $gte: inicioDoDia, $lte: fimDoDia },
    }).populate('servico', 'duracao'); // Traz a duração dos serviços já agendados

    // 3. Gerar todos os possíveis horários de início (slots) do dia
    // Usaremos incrementos de 15 minutos para maior flexibilidade
    const { horarioInicio, horarioFim } = oficina;
    const duracaoServicoAtual = servico.duracao;
    const slotsDisponiveis = [];
    
    let horaAtual = new Date(`${data}T${horarioInicio}:00.000Z`);
    const horaFim = new Date(`${data}T${horarioFim}:00.000Z`);

    while (horaAtual < horaFim) {
      const horarioSlot = horaAtual.toISOString();
      const fimSlot = new Date(horaAtual.getTime() + duracaoServicoAtual * 60000);

      // O slot só é válido se o serviço terminar dentro do horário de funcionamento
      if (fimSlot > horaFim) {
        break; 
      }

      // 4. Verificar conflitos com agendamentos existentes
      let temConflito = false;
      for (const agendamento of agendamentosExistentes) {
        const inicioAgendado = new Date(agendamento.data);
        // Precisamos da duração do serviço JÁ agendado
        const duracaoAgendada = agendamento.servico ? agendamento.servico.duracao : 60; // Duração padrão se não tiver serviço
        const fimAgendado = new Date(inicioAgendado.getTime() + duracaoAgendada * 60000);

        // Verifica se o novo slot se sobrepõe a um agendamento existente
        // Conflito: (InicioA < FimB) e (FimA > InicioB)
        if (horaAtual < fimAgendado && fimSlot > inicioAgendado) {
          temConflito = true;
          break;
        }
      }

      if (!temConflito) {
        // Formata para "HH:MM" para enviar ao frontend
        slotsDisponiveis.push(horaAtual.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }));
      }

      // Avança para o próximo slot de 15 minutos
      horaAtual = new Date(horaAtual.getTime() + 15 * 60000);
    }

    // 5. Por enquanto, a lógica de atendimentos simultâneos foi simplificada.
    // Esta lógica acima considera capacidade = 1. Podemos refatorar depois se necessário.
    res.json(slotsDisponiveis);

  } catch (error) {
    console.error(error);
    res.status(500).send('Erro no servidor');
  }
});

// @route   DELETE /api/agendamentos/:id
// @desc    Deleta um agendamento
// @access  Private (Admin ou Dono da Oficina)
router.delete('/:id', protect, async (req, res) => {
  try {
    const agendamento = await Agendamento.findById(req.params.id);

    if (!agendamento) {
      return res.status(404).json({ msg: 'Agendamento não encontrado' });
    }

    // Lógica de permissão: Garante que apenas um admin ou o dono/funcionário da oficina possa deletar.
    const eDonoDaOficina = req.user.oficina?.toString() === agendamento.oficina?.toString();

    if (req.user.role !== 'admin' && !eDonoDaOficina) {
      return res.status(403).json({ msg: 'Usuário não autorizado a deletar este agendamento' });
    }

    await agendamento.deleteOne();

    res.json({ msg: 'Agendamento removido com sucesso' });

  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Agendamento não encontrado' });
    }
    res.status(500).send('Erro no servidor');
  }
});


module.exports = router;