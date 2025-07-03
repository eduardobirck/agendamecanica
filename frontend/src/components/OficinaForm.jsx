import React, { useState, useEffect } from 'react';
import { Button, TextField, Grid, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function OficinaForm({ onSave, onCancel, oficinaParaEditar, users = [] }) {
  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState({ rua: '', numero: '', cidade: '', estado: '', cep: '' });

  const [proprietarioId, setProprietarioId] = useState('');

  useEffect(() => {
    if (oficinaParaEditar) {
      setNome(oficinaParaEditar.nome || '');
      setCnpj(oficinaParaEditar.cnpj || '');
      setTelefone(oficinaParaEditar.telefone || '');
      setEndereco(oficinaParaEditar.endereco || { rua: '', numero: '', cidade: '', estado: '', cep: '' });
      setProprietarioId(oficinaParaEditar.proprietario?._id || '');
    } else {
      setNome('');
      setCnpj('');
      setTelefone('');
      setEndereco({ rua: '', numero: '', cidade: '', estado: '', cep: '' });
      setProprietarioId('');
    }
  }, [oficinaParaEditar]);

  const handleEnderecoChange = (e) => {
    setEndereco({ ...endereco, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ nome, cnpj, telefone, endereco, proprietario: proprietarioId });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={8}>
          <TextField fullWidth label="Nome da Oficina" value={nome} onChange={(e) => setNome(e.target.value)} required />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField fullWidth label="CNPJ" value={cnpj} onChange={(e) => setCnpj(e.target.value)} required />
        </Grid>
         <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel id="select-owner-label">Proprietário</InputLabel>
              <Select
                labelId="select-owner-label"
                value={proprietarioId}
                label="Proprietário"
                onChange={(e) => setProprietarioId(e.target.value)}
              >
                {users.map(user => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Rua / Avenida" name="rua" value={endereco.rua} onChange={handleEnderecoChange} required />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField fullWidth label="Número" name="numero" value={endereco.numero} onChange={handleEnderecoChange} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField fullWidth label="CEP" name="cep" value={endereco.cep} onChange={handleEnderecoChange} required />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Cidade" name="cidade" value={endereco.cidade} onChange={handleEnderecoChange} required />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Estado" name="estado" value={endereco.estado} onChange={handleEnderecoChange} required />
        </Grid>
        
        <Grid item xs={12}>
            <TextField fullWidth label="Telefone de Contato" value={telefone} onChange={(e) => setTelefone(e.target.value)} required />
        </Grid>
      </Grid>
      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button type="submit" variant="contained">
          {oficinaParaEditar ? 'Salvar Alterações' : 'Salvar Oficina'}
        </Button>
        <Button onClick={onCancel}>Cancelar</Button>
      </Box>
    </Box>
  );
}

export default OficinaForm;