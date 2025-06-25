import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

// Nossos componentes reutilizáveis!
import AgendamentoForm from '../components/AgendamentoForm';
import ListaAgendamentos from '../components/ListaAgendamentos';

// Componentes do MUI
import { Box, Typography, CircularProgress, Alert, Button } from '@mui/material';

function WorkshopSchedulePage() {
  // 1. Pega o ID da oficina da URL
  const { oficinaId } = useParams();
  const navigate = useNavigate();

  const [oficina, setOficina] = useState(null);
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [agendamentoEmEdicao, setAgendamentoEmEdicao] = useState(null);

  // Função para buscar os agendamentos DESTA oficina
  const fetchAgendamentos = useCallback(async () => {
    try {
      // 2. Passa o oficinaId como parâmetro de consulta na URL
      const response = await api.get(`/agendamentos?oficinaId=${oficinaId}`);
      setAgendamentos(response.data);
    } catch (err) {
      setError('Não foi possível carregar os agendamentos.');
      console.error(err);
    }
  }, [oficinaId]);

  // useEffect para buscar os dados da oficina e os agendamentos
  useEffect(() => {
    const getInitialData = async () => {
      setLoading(true);
      try {
        // Busca os detalhes da oficina para mostrar o nome na página
        const oficinaResponse = await api.get(`/oficinas/${oficinaId}`);
        setOficina(oficinaResponse.data);
        
        // Em seguida, busca os agendamentos
        await fetchAgendamentos();
      } catch (err) {
        setError('Oficina não encontrada ou erro ao carregar dados.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getInitialData();
  }, [oficinaId, fetchAgendamentos]);

  // Função de salvar que agora inclui o ID da oficina
  const handleSave = async (dadosDoForm) => {
    // 3. Adiciona o ID da oficina aos dados que serão salvos
    const dadosParaSalvar = { ...dadosDoForm, oficina: oficinaId };

    try {
      if (agendamentoEmEdicao) {
        await api.put(`/agendamentos/${agendamentoEmEdicao._id}`, dadosParaSalvar);
        alert('Agendamento atualizado com sucesso!');
      } else {
        await api.post('/agendamentos', dadosParaSalvar);
        alert('Agendamento criado com sucesso!');
      }
      setAgendamentoEmEdicao(null);
      fetchAgendamentos(); // Atualiza a lista
    } catch (err) {
      alert('Erro ao salvar o agendamento.');
      console.error(err);
    }
  };

  const handleDelete = async (id) => { /* ... (a lógica de deletar pode ser adicionada aqui depois) ... */ };
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

      <AgendamentoForm 
        onSave={handleSave} 
        agendamentoParaEditar={agendamentoEmEdicao} 
        onCancelEdit={handleCancelEdit} 
      />
      
      <hr style={{ margin: '2rem 0' }} />

      <ListaAgendamentos 
        agendamentos={agendamentos} 
        onEdit={handleEdit} 
        onDelete={handleDelete}
      />
    </Box>
  );
}

export default WorkshopSchedulePage;