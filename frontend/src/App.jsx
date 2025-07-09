import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import { useAuth } from './context/AuthContext';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AgendamentosDashboard from './pages/AgendamentosDashboard';
import OficinasListPage from './pages/OficinasListPage';
import WorkshopSelectionPage from './pages/WorkshopSelectionPage';
import WorkshopSchedulePage from './pages/WorkshopSchedulePage';
import UserManagementPage from './pages/UserManagementPage';
import ServiceManagementPage from './pages/ServiceManagementPage';

// Componente PrivateRoute (sem alterações)
function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <CssBaseline />
      <Header /> 
      <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/" 
            element={<PrivateRoute><AgendamentosDashboard /></PrivateRoute>} 
          />
          <Route 
                path="/oficinas" 
                element={<PrivateRoute><OficinasListPage /></PrivateRoute>} 
           />
          <Route 
           path="/oficina/:oficinaId/servicos" 
            element={<PrivateRoute><ServiceManagementPage /></PrivateRoute>} 
          />
          <Route
            path="/oficinas-disponiveis"
            element={<PrivateRoute><WorkshopSelectionPage/></PrivateRoute>}
          />
          <Route
            path="/oficina/:oficinaId"
            element={<PrivateRoute><WorkshopSchedulePage /></PrivateRoute>}
          />
          <Route 
            path="/admin/users" 
            element={<PrivateRoute><UserManagementPage /></PrivateRoute>} 
          />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;