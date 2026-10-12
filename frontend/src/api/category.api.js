import api from './axios';

export const getCategories = async () => {
  const { data: resData } = await api.get('/categories');
  return resData;
};

export const createCategory = async (data) => {
  const { data: resData } = await api.post('/categories', data);
  return resData;
};

export const updateCategory = async (id, data) => {
  const { data: resData } = await api.patch(`/categories/${id}`, data);
  return resData;
};

export const deleteCategory = async (id) => {
  const { data: resData } = await api.delete(`/categories/${id}`);
  return resData;
};


