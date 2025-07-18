// Arquivo: frontend/src/pages/AgendamentosDashboard.jsx

import React, { useState, useEffect, useCallback } from 'react';
import AgendamentoForm from '../components/AgendamentoForm';
import ListaAgendamentos from '../components/ListaAgendamentos';
import { useAuth } from '../context/AuthContext';
import Button from '@mui/material/Button';
import api from '../api/api';

function AgendamentosDashboard() {
  const { logout, token } = useAuth();

  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [agendamentoEmEdicao, setAgendamentoEmEdicao] = useState(null);

  const fetchAgendamentos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/agendamentos');
      setAgendamentos(response.data);
    } catch (err) {
      setError('Falha ao buscar dados');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]); 

  useEffect(() => {
    if (token) {
      fetchAgendamentos();
    }
  }, [token, fetchAgendamentos]);

  const handleSave = async (dadosDoForm) => {
    try {
      if (agendamentoEmEdicao) {
        await api.put(`/agendamentos/${agendamentoEmEdicao._id}`, dadosDoForm);
      } else {
        await api.post('/agendamentos', dadosDoForm);
      }
      setAgendamentoEmEdicao(null);
      fetchAgendamentos();
    } catch (err) {
      console.error("Erro ao salvar:", err);
      alert('Erro ao salvar agendamento.');
    }
  };

  // Função para deletar
  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar?')) {
      try {
        await api.delete(`/agendamentos/${id}`);
        fetchAgendamentos();
      } catch (err) {
        console.error('Erro ao deletar:', err);
        alert('Erro ao deletar agendamento.');
      }
    }
  };

  const handleEdit = (agendamento) => setAgendamentoEmEdicao(agendamento);
  const handleCancelEdit = () => setAgendamentoEmEdicao(null);

  return (
    <div>
 
      <main style={{ padding: '1rem' }}>
        <AgendamentoForm 
          onSave={handleSave}
          agendamentoParaEditar={agendamentoEmEdicao}
          onCancelEdit={handleCancelEdit}
        />
        <hr style={{ margin: '2rem 0' }}/>
        <ListaAgendamentos 
          agendamentos={agendamentos} 
          loading={loading} 
          error={error}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
}

export default AgendamentosDashboard;