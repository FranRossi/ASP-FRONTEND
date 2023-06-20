import axios from 'axios';
import { baseUrl } from './baseService';

export const resetLocalStorage = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('companyId');
};
export const api = axios.create({
  baseURL: baseUrl,
  headers: {
    Accept: '/',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const headers = {
    Accept: '/',
    'Content-Type': 'application/json',
    'company-id': localStorage.getItem('company-id'),
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
  };
  return { ...config, headers };
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if ([400, 401].includes(error.response?.status)) {
      resetLocalStorage();
    }
    return Promise.reject(error);
  },
);

export const getData = async (endpoint, options = {}) => {
  const { data } = await api.get(endpoint, options);
  return data;
};

export default api;
