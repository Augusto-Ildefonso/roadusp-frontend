import axios from 'axios';

const TOKEN_KEY = 'roadusp_token';

const api = axios.create({
  baseURL: 'https://roadusp-backend.onrender.com',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('roadusp_user');
      localStorage.removeItem('roadusp_historico');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default api;
