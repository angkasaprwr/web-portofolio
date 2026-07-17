import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry && !original.url?.includes('/auth/login')) {
      original._retry = true;
      try {
        if (!refreshing) {
          refreshing = api.post('/auth/refresh').then((r) => {
            const token = r.data.data.accessToken;
            localStorage.setItem('accessToken', token);
            return token;
          }).finally(() => {
            refreshing = null;
          });
        }
        const token = await refreshing;
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      } catch {
        localStorage.removeItem('accessToken');
        if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/login')) {
          window.location.href = '/admin/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export const assetUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const base = import.meta.env.VITE_ASSET_URL || '';
  return `${base}${path}`;
};
