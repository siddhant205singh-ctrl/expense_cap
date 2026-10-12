import api from './axios';

export const getTransactions = async (params) => {
  const { data: resData } = await api.get('/transactions', { params });
  return resData;
};

export const getTransaction = async (id) => {
  const { data: resData } = await api.get(`/transactions/${id}`);
  return resData;
};

export const createTransaction = async (data) => {
  const { data: resData } = await api.post('/transactions', data);
  return resData;
};

export const updateTransaction = async (id, data) => {
  const { data: resData } = await api.patch(`/transactions/${id}`, data);
  return resData;
};

export const deleteTransaction = async (id) => {
  const { data: resData } = await api.delete(`/transactions/${id}`);
  return resData;
};


