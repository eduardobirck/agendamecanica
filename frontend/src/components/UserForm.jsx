import React, { useState, useEffect } from 'react';
import { Button, TextField, Grid, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

// O formulário recebe a lista de oficinas e de usuários para os dropdowns
function UserForm({ onSave, onCancel, userToEdit, workshops = [] }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [status, setStatus] = useState('ativo');
  const [oficina, setOficina] = useState('');

  const isEditMode = !!userToEdit;

  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name || '');
      setEmail(userToEdit.email || '');
      setRole(userToEdit.role || 'user');
      setStatus(userToEdit.status || 'ativo');
      setOficina(userToEdit.oficina?._id || '');
      setPassword(''); 
    } else {
      setName(''); setEmail(''); setPassword(''); setRole('user'); setStatus('ativo'); setOficina('');
    }
  }, [userToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, email, password, role, status, oficina });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Nome Completo" value={name} onChange={(e) => setName(e.target.value)} required />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isEditMode} />
        </Grid>
        {!isEditMode && ( 
          <Grid item xs={12}>
            <TextField fullWidth label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Grid>
        )}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Papel (Role)</InputLabel>
            <Select value={role} label="Papel (Role)" onChange={(e) => setRole(e.target.value)}>
              <MenuItem value="user">Cliente</MenuItem>
              <MenuItem value="funcionario">Funcionário</MenuItem>
              <MenuItem value="owner">Dono de Oficina</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value)}>
              <MenuItem value="ativo">Ativo</MenuItem>
              <MenuItem value="inativo">Inativo</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {(role === 'owner' || role === 'funcionario') && ( 
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Vincular à Oficina</InputLabel>
              <Select value={oficina} label="Vincular à Oficina" onChange={(e) => setOficina(e.target.value)}>
                <MenuItem value=""><em>Nenhuma</em></MenuItem>
                {workshops.map(ofc => (
                  <MenuItem key={ofc._id} value={ofc._id}>{ofc.nome}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
      </Grid>
      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button type="submit" variant="contained">
          {isEditMode ? 'Salvar Alterações' : 'Criar Usuário'}
        </Button>
        <Button onClick={onCancel}>Cancelar</Button>
      </Box>
    </Box>
  );
}

export default UserForm;