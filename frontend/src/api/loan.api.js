import api from './axios';

export const getLoans = async () => {
  const { data: resData } = await api.get('/loans');
  return resData;
};

export const createLoan = async (data) => {
  const { data: resData } = await api.post('/loans', data);
  return resData;
};

export const updateLoan = async (id, data) => {
  const { data: resData } = await api.patch(`/loans/${id}`, data);
  return resData;
};

export const deleteLoan = async (id) => {
  const { data: resData } = await api.delete(`/loans/${id}`);
  return resData;
};

export const addRepayment = async (id, payload) => {
  const { data: resData } = await api.post(`/loans/${id}/repayments`, payload);
  return resData;
};

export const removeRepayment = async ({ loanId, repaymentId }) => {
  const { data: resData } = await api.delete(`/loans/${loanId}/repayments/${repaymentId}`);
  return resData;
};


