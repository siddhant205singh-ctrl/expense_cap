import { createContext, useState, useEffect, useCallback } from 'react';
import * as authApi from '../api/auth.api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(() => {
    const token = localStorage.getItem('accessToken');
    return token && token !== 'undefined' ? token : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      if (accessToken && accessToken !== 'undefined') {
        const userData = await authApi.getMe();
        setUser(userData?.data || userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem('accessToken');
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (credentials) => {
    const data = await authApi.login(credentials);
    const token = data?.accessToken;
    const currentUser = data?.user || data;
    if (token) {
      localStorage.setItem('accessToken', token);
      setAccessToken(token);
    }
    if (currentUser) {
      setUser(currentUser);
    }
    return data;
  };

  const register = async (userData) => {
    const data = await authApi.register(userData);
    const token = data?.accessToken;
    const currentUser = data?.user || data;
    if (token) {
      localStorage.setItem('accessToken', token);
      setAccessToken(token);
    }
    if (currentUser) {
      setUser(currentUser);
    }
    return data;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.error('Logout error', e);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setAccessToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
