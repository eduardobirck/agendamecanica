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
          {/* O Título da Aplicação */}
          <Typography 
            variant="h6" 
            component={RouterLink} 
            to={isAuthenticated ? (user?.role === 'admin' ? '/' : '/oficinas-disponiveis') : '/login'}
            sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}
          >
            Agenda da Oficina
          </Typography>

          {/* Renderização Condicional dos Botões */}
          {isAuthenticated && (
            <>
              {user?.role === 'admin' ? (
                // ================== MENU DO ADMIN ==================
                <>
                  <Button color="inherit" component={RouterLink} to="/">Dashboard</Button>
                  <Button color="inherit" component={RouterLink} to="/oficinas">Oficinas</Button>
                  <Button color="inherit" component={RouterLink} to="/admin/users">Usuários</Button>
                </>
              ) : (
                // ================== MENU DO CLIENTE ==================
                <>
                  <Button color="inherit" component={RouterLink} to="/oficinas-disponiveis">Agendar Serviço</Button>
                  <Button color="inherit" component={RouterLink} to="/meus-agendamentos">Meus Agendamentos</Button>
                </>
              )}
              <Button color="inherit" onClick={handleLogout}>Sair</Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;