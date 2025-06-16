import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

// Importações do MUI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      alert('Registro bem-sucedido! Por favor, faça o login.');
      navigate('/login'); 
    } catch (error) {
      alert('Falha no registro.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Registrar
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>

          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Nome completo"
            name="nome"
            autoComplete="name"
            autoFocus
            value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" 
            />

            <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="E-mail"
            name="email"
            autoComplete="email"
            value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
            />

            <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            label="Senha"
            name="password"
            autoComplete="current-password"
            type="password"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
           />


        <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
           Registrar 
          </Button>
        </Box>
      </Box>
    </Container>
     
  );
}

export default RegisterPage;