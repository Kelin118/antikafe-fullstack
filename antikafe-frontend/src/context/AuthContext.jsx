import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [companyId, setCompanyId] = useState(localStorage.getItem('companyId') || '');
  const [role, setRole] = useState(localStorage.getItem('role') || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');

  const login = async ({ companyLogin, userLogin, password }) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
        companyLogin,
        userLogin,
        password,
      });

      const token = response.data.token;
      const companyId = response.data.companyId;
      const role = response.data.role;
      const username = response.data.username;

      setToken(token);
      setCompanyId(companyId);
      setRole(role);
      setUsername(username);

      localStorage.setItem('token', token);
      localStorage.setItem('companyId', companyId);
      localStorage.setItem('role', role);
      localStorage.setItem('username', username);

      return true;
    } catch (error) {
      console.error('Ошибка при входе:', error);
      return false;
    }
  };

  const logout = () => {
    setToken('');
    setCompanyId('');
    setRole('');
    setUsername('');

    localStorage.removeItem('token');
    localStorage.removeItem('companyId');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        isAuthenticated,
        companyId,
        role,
        username,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
