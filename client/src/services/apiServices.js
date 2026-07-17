import api from '../lib/api';

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  changePassword: (data) => api.post('/auth/change-password', data),
};

export const aboutApi = {
  get: () => api.get('/about'),
  upsert: (data) => api.put('/about', data),
};

export const skillsApi = {
  list: (params) => api.get('/skills', { params }),
  categories: () => api.get('/skills/categories'),
  get: (id) => api.get(`/skills/${id}`),
  create: (data) => api.post('/skills', data),
  update: (id, data) => api.put(`/skills/${id}`, data),
  remove: (id) => api.delete(`/skills/${id}`),
 cursor/portfolio-website-980a
  reorder: (orders) => api.put('/skills/reorder', { orders }),

 main
};

export const projectsApi = {
  list: (params) => api.get('/projects', { params }),
  categories: () => api.get('/projects/categories'),
  get: (id) => api.get(`/projects/${id}`),
  getBySlug: (slug) => api.get(`/projects/slug/${slug}`),
  create: (data) => api.post('/projects', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/projects/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  remove: (id) => api.delete(`/projects/${id}`),
};

export const experiencesApi = {
  list: (params) => api.get('/experiences', { params }),
  categories: () => api.get('/experiences/categories'),
  get: (id) => api.get(`/experiences/${id}`),
  create: (data) => api.post('/experiences', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/experiences/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  remove: (id) => api.delete(`/experiences/${id}`),
};

export const certificatesApi = {
  list: (params) => api.get('/certificates', { params }),
  create: (data) => api.post('/certificates', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/certificates/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  remove: (id) => api.delete(`/certificates/${id}`),
};

export const socialApi = {
  list: (params) => api.get('/social-links', { params }),
  create: (data) => api.post('/social-links', data),
  update: (id, data) => api.put(`/social-links/${id}`, data),
  remove: (id) => api.delete(`/social-links/${id}`),
};

export const cvApi = {
  getActive: () => api.get('/cv'),
  list: (params) => api.get('/cv/list', { params }),
  adminList: () => api.get('/admin/cv'),
  create: (data) => api.post('/cv', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/cv/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  remove: (id) => api.delete(`/cv/${id}`),
  trackDownload: (id) => api.post(`/cv/${id}/download`),
};

export const settingsApi = {
  list: () => api.get('/settings'),
  upsert: (key, value) => api.put(`/settings/${key}`, { value }),
};

export const dashboardApi = {
  overview: () => api.get('/dashboard'),
};

export const uploadApi = {
  image: (file, folder = 'images') => {
    const form = new FormData();
    form.append('file', file);
    return api.post(`/upload/${folder}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};
