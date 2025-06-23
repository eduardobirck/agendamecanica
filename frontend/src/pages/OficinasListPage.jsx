import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import OficinaForm from '../components/OficinaForm';

import { Box, Card, CardContent, CircularProgress, Typography, Grid, Button, Dialog, DialogTitle, DialogContent, CardActions } from '@mui/material';

function OficinasListPage() {
  const { token } = useAuth();
  const [oficinas, setOficinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [oficinaEmEdicao, setOficinaEmEdicao] = useState(null);

  const fetchOficinas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/oficinas');
      console.log('Dados recebidos da API:', response.data);
      setOficinas(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Erro ao buscar oficinas:", err);
      setError("Não foi possível carregar a lista de oficinas.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchOficinas();
    } else {
      setLoading(false); 
    }
  }, [fetchOficinas, token]);

const handleOpenModalParaCriar = () => {
    setOficinaEmEdicao(null); 
    setOpenModal(true);
  };
  
  const handleOpenModalParaEditar = (oficina) => {
    setOficinaEmEdicao(oficina); 
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
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

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error" align="center">{error}</Typography>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">Gerenciar Oficinas</Typography>
        <Button variant="contained" onClick={handleOpenModalParaCriar}>Adicionar Nova Oficina</Button>
      </Box>

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle>{oficinaEmEdicao ? 'Editar Oficina' : 'Nova Oficina'}</DialogTitle>
        <DialogContent>
          <OficinaForm 
            onSave={handleSaveOficina} 
            onCancel={handleCloseModal} 
            oficinaParaEditar={oficinaEmEdicao} 
          />
        </DialogContent>
      </Dialog>
      
      {oficinas.length === 0 ? (
        <Typography sx={{ mt: 4, textAlign: 'center' }}>Nenhuma oficina cadastrada ainda.</Typography>
      ) : (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {oficinas.map((oficina) => {
            console.log(`Renderizando card para "${oficina.nome}" com ID: ${oficina._id}`);

            return (
            <Grid item xs={12} sm={6} md={4} key={oficina._id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" component="h2" gutterBottom>{oficina.nome}</Typography>
                  <Typography color="text.secondary">CNPJ: {oficina.cnpj}</Typography>
                  <Typography color="text.secondary" sx={{ mb: 1.5 }}>Telefone: {oficina.telefone}</Typography>
                  <Typography variant="body2">
                    {oficina.endereco ? (
                      <>
                        {`${oficina.endereco.rua || ''}, ${oficina.endereco.numero || 'S/N'}`}<br />
                        {`${oficina.endereco.cidade || ''} - ${oficina.endereco.estado || ''}`}
                      </>
                    ) : 'Endereço não cadastrado'}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleOpenModalParaEditar(oficina)}>Editar</Button>
                  <Button  size="small" color="error" onClick={() => handleDeleteOficina(oficina._id)} > Deletar </Button>
                </CardActions>
              </Card>
            </Grid>
          )
          })}
        </Grid>
      )}
    </Box>
  );
}

export default OficinasListPage;