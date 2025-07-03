import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import OficinaForm from '../components/OficinaForm';

import { 
  Box, Card, CardActions, CardContent, CircularProgress, Typography, 
  Grid, Button, Dialog, DialogTitle, DialogContent, 
  Select, MenuItem, FormControl, InputLabel, DialogActions
} from '@mui/material';

function OficinasListPage() {
  const { token } = useAuth();
  const [oficinas, setOficinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editCreateModalOpen, setEditCreateModalOpen] = useState(false);
  const [oficinaEmEdicao, setOficinaEmEdicao] = useState(null);

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [users, setUsers] = useState([]); 
  const [selectedUserId, setSelectedUserId] = useState(''); 
  const [selectedOficina, setSelectedOficina] = useState(null); 

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [oficinasRes, usersRes] = await Promise.all([
        api.get('/oficinas'),
        api.get('/users')
      ]);
      setOficinas(oficinasRes.data);
      setUsers(usersRes.data.filter(user => user.role !== 'admin')); 
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      setError("Não foi possível carregar os dados da página.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, fetchData]);

const handleOpenCreateModal = () => {
    setOficinaEmEdicao(null); 
    setEditCreateModalOpen(true);
  };
  const handleOpenEditModal = (oficina) => {
    setOficinaEmEdicao(oficina); 
    setEditCreateModalOpen(true);
  };
  const handleCloseCreateEditModal = () => {
    setEditCreateModalOpen(false);
    setOficinaEmEdicao(null);
  };

  const handleSaveOficina = async (dadosDaOficina) => {
    try {
      if (oficinaEmEdicao) {
        await api.put(`/oficinas/${oficinaEmEdicao._id}`, dadosDaOficina);
        alert('Oficina atualizada com sucesso!');
      } else {
        await api.post('/oficinas', dadosDaOficina);
        alert('Oficina salva com sucesso!');
      }
      handleCloseModal();
      fetchOficinas();
    } catch (err) {
      console.error("Erro ao salvar oficina:", err);
      const errorMessage = err.response?.data?.errors?.[0]?.msg || 'Falha ao salvar oficina.';
      alert(`Erro: ${errorMessage}`);
    }
  };

  const handleDeleteOficina = async (id)=> {
    console.log(`FUNÇÃO handleDeleteOficina CHAMADA COM O ID: ${id}`);
    if (window.confirm('Tem certeza que deseja deletar esta oficina?')){
      try {
        await api.delete(`/oficinas/${id}`);
        alert('Oficina deletada com sucesso');
        fetchOficinas();
      } catch(err) {
        console.error("Erro ao deletar a oficina", err);
        alert('Não foi possível deletar a oficina.');
      }
    }
  };

  const handleOpenAssignModal = (oficina) => {
    setSelectedOficina(oficina);
    setSelectedUserId(oficina.proprietario?._id || ''); 
    setAssignModalOpen(true);
  };
  const handleCloseAssignModal = () => {
    setAssignModalOpen(false);
    setSelectedOficina(null);
    setSelectedUserId('');
  };
  const handleAssignOwner = async () => {
    if (!selectedUserId || !selectedOficina) {
      alert("Por favor, selecione um usuário.");
      return;
    }
    try {
      await api.put(`/users/${selectedUserId}/assign-workshop`, { oficinaId: selectedOficina._id });
      handleCloseAssignModal();
      fetchData(); 
      alert('Dono vinculado com sucesso!');
    } catch (err) {
      console.error("Erro ao vincular dono:", err);
      alert('Erro ao vincular dono.');
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error" align="center">{error}</Typography>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">Gerenciar Oficinas</Typography>
        <Button variant="contained" onClick={handleOpenCreateModal}>Adicionar Nova Oficina</Button>
      </Box>

      {/* Modal de Criar/Editar Oficina */}
      <Dialog open={editCreateModalOpen} onClose={handleCloseCreateEditModal} maxWidth="md" fullWidth>
        <DialogTitle>{oficinaEmEdicao ? 'Editar Oficina' : 'Nova Oficina'}</DialogTitle>
        <DialogContent>
          <OficinaForm 
            onSave={handleSaveOficina} 
            onCancel={handleCloseCreateEditModal} 
            oficinaParaEditar={oficinaEmEdicao} 
            users={users}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={assignModalOpen} onClose={handleCloseAssignModal} fullWidth maxWidth="xs">
        <DialogTitle>Vincular Dono para "{selectedOficina?.nome}"</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="select-user-label">Selecione um Usuário</InputLabel>
            <Select
              labelId="select-user-label"
              value={selectedUserId}
              label="Selecione um Usuário"
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <MenuItem value=""><em>Nenhum</em></MenuItem>
              {users.map(user => (
                <MenuItem key={user._id} value={user._id}>{user.name} ({user.email})</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssignModal}>Cancelar</Button>
          <Button onClick={handleAssignOwner} variant="contained">Salvar Vínculo</Button>
        </DialogActions>
      </Dialog>

      {oficinas.length === 0 ? (
        <Typography sx={{ mt: 4, textAlign: 'center' }}>Nenhuma oficina cadastrada ainda.</Typography>
      ) : (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {oficinas.map((oficina) => (
            <Grid item xs={12} sm={6} md={4} key={oficina._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom>{oficina.nome}</Typography>
                  <Typography color="text.secondary">CNPJ: {oficina.cnpj}</Typography>
                  <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                    Proprietário: {oficina.proprietario ? oficina.proprietario.name : 'Nenhum'}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleOpenEditModal(oficina)}>Editar</Button>
                  <Button size="small" onClick={() => handleOpenAssignModal(oficina)}>Vincular Dono</Button> 
                  <Button size="small" color="error" onClick={() => handleDeleteOficina(oficina._id)}>Deletar</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default OficinasListPage;