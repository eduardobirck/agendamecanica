import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

import { Box, Button, Container, TextField, Typography, Grid } from '@mui/material';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

function OficinaRegisterPage() {
    const { token } = useAuth();
    const navigate = useNavigate();

     // Estado para os campos principais
    const [nome, setNome] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [telefone, setTelefone] = useState('');

    const [endereco, setEndereco] = useState({
        rua: '',
        numero: '',
        cidade: '',
        estado: '',
        cep: '',
    });

    const handleEnderecoChange = (e) => {
    setEndereco({
      ...endereco,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dadosDaOficina = { nome, cnpj, telefone, endereco };

    try {
      await api.post('/oficinas', dadosDaOficina, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      alert('Oficina cadastrada com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('Erro ao cadastrar oficina:', error.response.data);
      const errorMessage = error.response?.data?.errors?.[0]?.msg || 'Falha ao cadastrar oficina.';
      alert(`Erro: ${errorMessage}`);
    }
  };

   return (
    <Container maxWidth="md">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mt: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Cadastro de nova oficina
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <TextField fullWidth label="Nome da Oficina" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="CNPJ" value={cnpj} onChange={(e) => setCnpj(e.target.value)} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Logradouro" name="rua" value={endereco.rua} onChange={handleEnderecoChange} required />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField fullWidth label="Número endereço" name="numero" value={endereco.numero} onChange={handleEnderecoChange} />
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
        
        <Box sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" size="large">
            Cadastrar Oficina
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default OficinaRegisterPage;