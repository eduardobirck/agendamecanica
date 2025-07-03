import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Importações do MUI
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); 
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography 
            variant="h6" 
            component={RouterLink} 
            to="/" 
            sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}
          >
            Agenda da Oficina
          </Typography>

          {isAuthenticated ? (
            <>
              <Button color="inherit" component={RouterLink} to="/">Agendamentos</Button>
              {user && user.role === 'admin' && (<>
                <Button color="inherit" component={RouterLink} to="/oficinas">
                  Oficinas
                </Button>
                <Button color="inherit" component={RouterLink} to="/admin/users">Usuários</Button>
              </>)}              
              <Button color="inherit" onClick={handleLogout}>Sair</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">Login</Button>
              <Button color="inherit" component={RouterLink} to="/register">Registrar</Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;