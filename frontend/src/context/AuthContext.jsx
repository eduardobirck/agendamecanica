import React, { createContext, useState, useContext } from 'react';
import axios from 'axios'; // Usaremos axios para facilitar as chamadas de API

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Criamos uma instância do axios com a URL base da nossa API
  const api = axios.create({
    baseURL: 'http://localhost:3001/api',
  });

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.token) {
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token); // Salva o token no localStorage
      }
    } catch (error) {
      console.error('Falha no login', error);
      throw error; 
    }
  };
  
  const register = async (name, email, password) => {
    try {
      await api.post('/auth/register', { name, email, password });
    } catch(error) {
      console.error('Falha no registro', error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  const value = {
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token, 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};