import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import { useAuth } from './context/AuthContext';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

// Importe todas as suas páginas
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AgendamentosDashboard from './pages/AgendamentosDashboard';
import OficinaRegisterPage from './pages/OficinaRegisterPage';

// Componente PrivateRoute (sem alterações)
function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <CssBaseline />
      <Header /> {/* O Header agora está aqui fora, no topo */}
      
      {/* O Container envolve apenas o conteúdo principal da página */}
      <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/" 
            element={<PrivateRoute><AgendamentosDashboard /></PrivateRoute>} 
          />
          <Route 
            path="/cadastrar-mecanica" 
            element={<PrivateRoute><OficinaRegisterPage /></PrivateRoute>} 
          />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;