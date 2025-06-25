import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios'; 
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null); 

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken.user); 
      } catch (error) {
        console.error("Token inválido", error);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    }
  }, [token]);

  const api = axios.create({
    baseURL: 'http://localhost:3001/api',
  });

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.token) {
        const token = response.data.token;
        setToken(token);
        localStorage.setItem('token', token);

        const decodedToken = jwtDecode(token);
        setUser(decodedToken.user);

        return decodedToken.user;
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
    setUser(null); 
    localStorage.removeItem('token');
  };

  const value = {
    token,
    user,
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