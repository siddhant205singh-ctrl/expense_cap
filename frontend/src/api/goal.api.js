import api from './axios';

export const getGoals = async () => {
  const { data: resData } = await api.get('/goals');
  return resData;
};

export const createGoal = async (data) => {
  const { data: resData } = await api.post('/goals', data);
  return resData;
};

export const updateGoal = async (id, data) => {
  const { data: resData } = await api.patch(`/goals/${id}`, data);
  return resData;
};

export const deleteGoal = async (id) => {
  const { data: resData } = await api.delete(`/goals/${id}`);
  return resData;
};

export const addContribution = async (id, payload) => {
  const { data: resData } = await api.post(`/goals/${id}/contributions`, payload);
  return resData;
};

export const removeContribution = async ({ goalId, contributionId }) => {
  const { data: resData } = await api.delete(`/goals/${goalId}/contributions/${contributionId}`);
  return resData;
};


