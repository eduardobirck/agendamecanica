import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';

// Importações do MUI
import { Box, Typography, Button, CircularProgress, Alert, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle, DialogContent, TextField, DialogActions, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function ServiceManagementPage() {
  const { oficinaId } = useParams();
  const navigate = useNavigate();

  const [oficina, setOficina] = useState(null);
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para o modal de criação/edição de serviço
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [servicoEmEdicao, setServicoEmEdicao] = useState(null);
  const [formData, setFormData] = useState({ nome: '', duracao: '', preco: '' });

  const fetchData = useCallback(async () => {
    try {
      // Usamos Promise.all para buscar os dados em paralelo
      const [oficinaRes, servicosRes] = await Promise.all([
        api.get(`/oficinas/${oficinaId}`),
        api.get(`/servicos?oficinaId=${oficinaId}`)
      ]);
      setOficina(oficinaRes.data);
      setServicos(servicosRes.data);
    } catch (err) {
      setError('Não foi possível carregar os dados.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [oficinaId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenModal = (servico = null) => {
    setServicoEmEdicao(servico);
    setFormData({
      nome: servico ? servico.nome : '',
      duracao: servico ? servico.duracao : '',
      preco: servico ? servico.preco : ''
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSaveService = async () => {
    if (!formData.nome || !formData.duracao) {
      alert('Nome e Duração são obrigatórios.');
      return;
    }
    
    try {
      if (servicoEmEdicao) {
        const dadosDoServico = { nome: formData.nome, duracao: formData.duracao, preco: formData.preco };
        await api.put(`/servicos/${servicoEmEdicao._id}`, dadosDoServico);
      } else {
        const dadosDoServico = { ...formData, oficina: oficinaId };
        await api.post('/servicos', dadosDoServico);
      }
      handleCloseModal();
      fetchData(); 
    } catch (err) {
      alert('Erro ao salvar o serviço.');
      console.error(err);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm('Tem certeza que deseja deletar este serviço?')) {
      try {
        await api.delete(`/servicos/${serviceId}`);
        fetchData(); // Atualiza a lista
      } catch (err) {
        alert('Erro ao deletar o serviço.');
        console.error(err);
      }
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Button onClick={() => navigate('/oficinas')} sx={{ mb: 2 }}>&larr; Voltar</Button>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">
          Serviços da Oficina: {oficina?.nome}
        </Typography>
        <Button variant="contained" onClick={() => handleOpenModal()}>Adicionar Serviço</Button>
      </Box>

      {/* Modal para Adicionar/Editar Serviço */}
      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>{servicoEmEdicao ? 'Editar Serviço' : 'Adicionar Novo Serviço'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField autoFocus margin="dense" name="nome" label="Nome do Serviço" type="text" fullWidth variant="outlined" value={formData.nome} onChange={handleFormChange} />
            <TextField margin="dense" name="duracao" label="Duração (em minutos)" type="number" fullWidth variant="outlined" value={formData.duracao} onChange={handleFormChange} />
            <TextField margin="dense" name="preco" label="Preço (R$)" type="number" fullWidth variant="outlined" value={formData.preco} onChange={handleFormChange} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button onClick={handleSaveService} variant="contained">Salvar</Button>
        </DialogActions>
      </Dialog>
      
      {/* Tabela de Serviços */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell align="right">Duração (minutos)</TableCell>
              <TableCell align="right">Preço (R$)</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {servicos.map((servico) => (
              <TableRow key={servico._id}>
                <TableCell>{servico.nome}</TableCell>
                <TableCell align="right">{servico.duracao}</TableCell>
                <TableCell align="right">{servico.preco?.toFixed(2) || 'N/A'}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenModal(servico)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDeleteService(servico._id)} color ="error"> <DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ServiceManagementPage;