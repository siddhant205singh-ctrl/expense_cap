import api from './axios';

export const getFixedCosts = async () => {
  const { data: resData } = await api.get('/fixed-costs');
  return resData;
};

export const createFixedCost = async (data) => {
  const { data: resData } = await api.post('/fixed-costs', data);
  return resData;
};

export const updateFixedCost = async (id, data) => {
  const { data: resData } = await api.patch(`/fixed-costs/${id}`, data);
  return resData;
};

export const deleteFixedCost = async (id) => {
  const { data: resData } = await api.delete(`/fixed-costs/${id}`);
  return resData;
};

export const markAsPaid = async ({ id, date, walletId }) => {
  const { data: resData } = await api.post(`/fixed-costs/${id}/pay`, { date, walletId });
  return resData;
};


