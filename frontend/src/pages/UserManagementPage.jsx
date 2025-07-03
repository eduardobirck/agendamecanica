import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/api';
import UserForm from '../components/UserForm'; // Importe o novo formulário

import { Box, Typography, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Dialog, DialogTitle, DialogContent } from '@mui/material';

function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [workshops, setWorkshops] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Busca usuários e oficinas ao mesmo tempo
      const [usersRes, workshopsRes] = await Promise.all([
        api.get('/users'),
        api.get('/oficinas/public')
      ]);
      setUsers(usersRes.data);
      setWorkshops(workshopsRes.data);
    } catch (err) {
      setError('Não foi possível carregar os dados.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenModal = () => {
    setUserToEdit(null); // Garante que estamos no modo de criação
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveUser = async (userData) => {
    try {
      await api.post('/users', userData);
      alert('Usuário criado com sucesso!');
      handleCloseModal();
      fetchData(); 
    } catch (err) {
      const errorMessage = err.response?.data?.msg || 'Falha ao criar usuário.';
      alert(`Erro: ${errorMessage}`);
      console.error(err);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error" align="center">{error}</Typography>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gerenciamento de Usuários
        </Typography>
        <Button variant="contained" onClick={handleOpenModal}>
          Adicionar Usuário
        </Button>
      </Box>

      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>{userToEdit ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
        <DialogContent>
          <UserForm 
            onSave={handleSaveUser}
            onCancel={handleCloseModal}
            userToEdit={userToEdit}
            workshops={workshops} 
          />
        </DialogContent>
      </Dialog>
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="tabela de usuários">
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Papel (Role)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Oficina Vinculada</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell component="th" scope="row">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.role} 
                    color={user.role === 'admin' ? 'secondary' : 'primary'} 
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={user.status} 
                    color={user.status === 'ativo' ? 'success' : 'error'} 
                    size="small"
                  />
                </TableCell>
                <TableCell>{user.oficina?.nome || 'N/A'}</TableCell>
                <TableCell align="right">
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default UserManagementPage;