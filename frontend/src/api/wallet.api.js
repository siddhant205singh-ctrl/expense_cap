import api from './axios';

export const getWallets = async () => {
  const { data: resData } = await api.get('/wallets');
  return resData;
};

export const getWallet = async (id) => {
  const { data: resData } = await api.get(`/wallets/${id}`);
  return resData;
};

export const createWallet = async (data) => {
  const { data: resData } = await api.post('/wallets', data);
  return resData;
};

export const updateWallet = async (id, data) => {
  const { data: resData } = await api.patch(`/wallets/${id}`, data);
  return resData;
};

export const deleteWallet = async (id) => {
  const { data: resData } = await api.delete(`/wallets/${id}`);
  return resData;
};

export const transferBetweenWallets = async (data) => {
  const { data: resData } = await api.post('/wallets/transfer', data);
  return resData;
};


