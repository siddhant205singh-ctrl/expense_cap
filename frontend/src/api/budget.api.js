import api from './axios';

export const getBudgets = async () => {
  const { data: resData } = await api.get('/budgets');
  return resData;
};

export const createBudget = async (data) => {
  const { data: resData } = await api.post('/budgets', data);
  return resData;
};

export const updateBudget = async (id, data) => {
  const { data: resData } = await api.patch(`/budgets/${id}`, data);
  return resData;
};

export const deleteBudget = async (id) => {
  const { data: resData } = await api.delete(`/budgets/${id}`);
  return resData;
};


