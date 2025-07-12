import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const login = async ({ companyLogin, userLogin, password }) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
      companyLogin,
      userLogin,
      password,
    });

  const token = response.data.token;
    setToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('role', response.data.role);
    localStorage.setItem('username', response.data.username);
    localStorage.setItem('companyId', response.data.companyId); // ✅ добавлено

    return true;
  } catch (error) {
    console.error('Ошибка при входе:', error);
    return false;
  }
};



  const logout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
