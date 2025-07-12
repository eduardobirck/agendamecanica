import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';

// Importações do MUI
import { Box, Typography, CircularProgress, Alert, Button, TextField, Paper, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';

function WorkshopSchedulePage() {
  const { oficinaId } = useParams();
  const navigate = useNavigate();

  const [oficina, setOficina] = useState(null);
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para controlar a seleção do usuário
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
  // Estados para a busca de disponibilidade
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);

  // Estados para os dados pessoais do formulário
  const [formData, setFormData] = useState({ nomeCliente: '', veiculo: '', placa: '', telefone: '' });

  // Busca inicial dos dados da oficina e seus serviços
  useEffect(() => {
    const getInitialData = async () => {
      try {
        const [oficinaRes, servicosRes] = await Promise.all([
          api.get(`/oficinas/${oficinaId}`),
          api.get(`/servicos?oficinaId=${oficinaId}`)
        ]);
        setOficina(oficinaRes.data);
        setServicos(servicosRes.data);
      } catch (err) {
        setError('Não foi possível carregar os dados da oficina.');
      } finally {
        setLoading(false);
      }
    };
    getInitialData();
  }, [oficinaId]);

  // Busca os horários disponíveis sempre que o serviço ou a data mudam
  useEffect(() => {
    if (selectedServiceId && selectedDate) {
      const fetchAvailableSlots = async () => {
        setIsFetchingSlots(true);
        setAvailableSlots([]);
        setSelectedTime(''); // Limpa a hora selecionada
        try {
          const response = await api.get(`/agendamentos/disponibilidade?oficinaId=${oficinaId}&data=${selectedDate}&servicoId=${selectedServiceId}`);
          setAvailableSlots(response.data);
        } catch (err) {
          console.error("Erro ao buscar horários:", err);
        } finally {
          setIsFetchingSlots(false);
        }
      };
      fetchAvailableSlots();
    }
  }, [selectedServiceId, selectedDate, oficinaId]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dadosCompletos = {
      ...formData,
      servico: selectedServiceId,
      data: selectedDate,
      hora: selectedTime,
      oficina: oficinaId,
    };
    try {
      await api.post('/agendamentos', dadosCompletos);
      alert('Agendamento realizado com sucesso!');
      navigate('/oficinas-disponiveis'); // Volta para a lista de oficinas
    } catch (err) {
      alert('Erro ao realizar o agendamento.');
      console.error(err);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Button onClick={() => navigate('/oficinas-disponiveis')} sx={{ mb: 2 }}>&larr; Voltar</Button>
      <Typography variant="h4" component="h1">{oficina?.nome}</Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>Faça seu agendamento</Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Passo 1: Selecionar Serviço */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6">1. Selecione o Serviço</Typography>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Serviço</InputLabel>
                <Select value={selectedServiceId} label="Serviço" onChange={(e) => setSelectedServiceId(e.target.value)}>
                  {servicos.map(s => <MenuItem key={s._id} value={s._id}>{s.nome} ({s.duracao} min)</MenuItem>)}
                </Select>
              </FormControl>
            </Paper>
          </Grid>

          {/* Passo 2: Selecionar Data (só habilita após selecionar serviço) */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6">2. Escolha uma Data</Typography>
              <TextField fullWidth type="date" sx={{ mt: 2 }} onChange={(e) => setSelectedDate(e.target.value)} disabled={!selectedServiceId} />
            </Paper>
          </Grid>

          {/* Passo 3: Selecionar Hora e Preencher Dados (só habilita após selecionar data) */}
          {selectedDate && (
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6">3. Escolha um Horário e Preencha seus Dados</Typography>
                {isFetchingSlots ? <CircularProgress sx={{ my: 2 }} /> : (
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Horário Disponível</InputLabel>
                        <Select value={selectedTime} label="Horário Disponível" onChange={(e) => setSelectedTime(e.target.value)}>
                          {availableSlots.length > 0 ? 
                           availableSlots.map(slot => <MenuItem key={slot} value={slot}>{slot}</MenuItem>) :
                           <MenuItem disabled>Nenhum horário disponível</MenuItem>
                          }
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth required name="nomeCliente" label="Seu Nome" onChange={handleFormChange} /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth name="veiculo" label="Veículo (Modelo)" onChange={handleFormChange} /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth required name="placa" label="Placa" onChange={handleFormChange} /></Grid>
                    <Grid item xs={12}><TextField fullWidth name="telefone" label="Telefone" onChange={handleFormChange} /></Grid>
                  </Grid>
                )}
              </Paper>
            </Grid>
          )}

          <Grid item xs={12}>
            <Button type="submit" variant="contained" size="large" disabled={!selectedTime || !formData.nomeCliente || !formData.placa}>
              Confirmar Agendamento
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default WorkshopSchedulePage;