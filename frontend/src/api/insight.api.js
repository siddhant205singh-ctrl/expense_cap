import api from './axios';

export const getDashboardSummary = async (month) => {
  const { data: resData } = await api.get('/insights/dashboard', { params: { month } });
  return resData;
};

export const getSpendingByCategory = async (params) => {
  const { data: resData } = await api.get('/insights/spending-by-category', { params });
  return resData;
};

export const getMonthlyIncomeExpense = async (params) => {
  const { data: resData } = await api.get('/insights/monthly-income-expense', { params });
  return resData;
};

export const getSpendingTrend = async (params) => {
  const { data: resData } = await api.get('/insights/spending-trend', { params });
  return resData;
};


