import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('ghostmode_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const saveUser = (userData, token) => {
    setUser(userData);
    if (token) {
      localStorage.setItem('ghostmode_token', token);
    }
    localStorage.setItem('ghostmode_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ghostmode_token');
    localStorage.removeItem('ghostmode_user');
  };

  const memoValue = useMemo(() => ({ user, saveUser, logout, loading, setLoading, api }), [user, loading]);

  return <AuthContext.Provider value={memoValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
