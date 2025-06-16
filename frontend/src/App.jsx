import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import CssBaseline from '@mui/material/CssBaseline'; 
import Container from '@mui/material/Container'; 

// Importe suas páginas e componentes
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AgendamentosDashboard from './pages/AgendamentosDashboard'; // Vamos criar este em seguida

// Componente para proteger rotas
function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <CssBaseline /> 
      <Container maxWidth="lg">
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <AgendamentosDashboard />
              </PrivateRoute>
            } 
          />
        </Routes>
      </div>
      </Container>
    </Router>
  );
}

export default App;