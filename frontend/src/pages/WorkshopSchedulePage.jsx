import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';

// Nossos componentes reutilizáveis!
import AgendamentoForm from '../components/AgendamentoForm';
import ListaAgendamentos from '../components/ListaAgendamentos';

import { Box, Typography, CircularProgress, Alert, Button, TextField, Paper } from '@mui/material';

function WorkshopSchedulePage() {
  const { oficinaId } = useParams();
  const navigate = useNavigate();

  const [oficina, setOficina] = useState(null);
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [agendamentoEmEdicao, setAgendamentoEmEdicao] = useState(null);

  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);

  const fetchAgendamentos = useCallback(async () => {
    try {
      const response = await api.get(`/agendamentos?oficinaId=${oficinaId}`);
      setAgendamentos(response.data);
    } catch (err) {
      setError('Não foi possível carregar os agendamentos.');
      console.error(err);
    }
  }, [oficinaId]);

  useEffect(() => {
    const getOficinaDetails = async () => {
      try {
        const oficinaResponse = await api.get(`/oficinas/${oficinaId}`);
        setOficina(oficinaResponse.data);
      } catch (err) {
        setError('Oficina não encontrada.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getOficinaDetails();
  }, [oficinaId]);

  // useEffect para buscar os horários disponíveis QUANDO A DATA MUDA
  useEffect(() => {
    if (selectedDate) {
      const fetchAvailableSlots = async () => {
        setIsFetchingSlots(true);
        setAvailableSlots([]); // Limpa os slots antigos
        try {
          const response = await api.get(`/agendamentos/disponibilidade?oficinaId=${oficinaId}&data=${selectedDate}`);
          setAvailableSlots(response.data);
        } catch (err) {
          console.error("Erro ao buscar horários:", err);
          alert("Não foi possível buscar os horários para esta data.");
        } finally {
          setIsFetchingSlots(false);
        }
      };
      fetchAvailableSlots();
    }
  }, [selectedDate, oficinaId]);
  
  // useEffect para buscar os agendamentos existentes QUANDO A DATA MUDA
  useEffect(() => {
    if (selectedDate) {
      const fetchAgendamentos = async () => {
        try {
          const response = await api.get(`/agendamentos?oficinaId=${oficinaId}&data=${selectedDate}`);
          setAgendamentos(response.data);
        } catch (err) {
          console.error("Erro ao buscar agendamentos:", err);
        }
      };
      fetchAgendamentos();
    }
  }, [selectedDate, oficinaId]);

  const handleSave = async (dadosDoForm) => {
    // Adiciona a data e o ID da oficina aos dados
    const dadosParaSalvar = { ...dadosDoForm, data: selectedDate, oficina: oficinaId };
    try {
      await api.post('/agendamentos', dadosParaSalvar);
      alert('Agendamento criado com sucesso!');

      setSelectedDate('');
      setAvailableSlots([]);
      setAgendamentos([]);
    } catch (err) {
      alert('Erro ao salvar o agendamento.');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {  };
  const handleEdit = (agendamento) => setAgendamentoEmEdicao(agendamento);
  const handleCancelEdit = () => setAgendamentoEmEdicao(null);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

 return (
    <Box>
      <Button onClick={() => navigate('/oficinas-disponiveis')} sx={{ mb: 2 }}>
        &larr; Voltar para a lista de oficinas
      </Button>
      <Typography variant="h4" component="h1">{oficina?.nome}</Typography>
      <Typography variant="h6" component="h2" color="text.secondary" gutterBottom>
        Faça seu agendamento
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6">1. Escolha uma data</Typography>
        <TextField
          fullWidth
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          sx={{ mt: 2 }}
        />
      </Paper>

      {selectedDate && (
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>2. Preencha seus dados e escolha um horário</Typography>
          {isFetchingSlots ? (
            <CircularProgress />
          ) : (
            <AgendamentoForm 
              onSave={handleSave} 
              availableSlots={availableSlots} 
            />
          )}
        </Paper>
      )}
    </Box>
  );
}

export default WorkshopSchedulePage;