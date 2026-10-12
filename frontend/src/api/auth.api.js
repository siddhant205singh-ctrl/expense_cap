import api from './axios';

export const register = async (data) => {
  const { data: resData } = await api.post('/auth/register', data);
  return resData;
};

export const login = async (credentials) => {
  const { data: resData } = await api.post('/auth/login', credentials);
  return resData;
};

export const logout = async () => {
  const { data: resData } = await api.post('/auth/logout');
  return resData;
};

export const getMe = async () => {
  const { data: resData } = await api.get('/auth/me');
  return resData;
};

export const changePassword = async (data) => {
  const { data: resData } = await api.post('/auth/change-password', data);
  return resData;
};


