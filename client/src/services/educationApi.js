import api from '../lib/api';

export const educationsApi = {
  list: (params) => api.get('/educations', { params }),
  get: (id) => api.get(`/educations/${id}`),
  create: (data) => api.post('/educations', data),
  update: (id, data) => api.put(`/educations/${id}`, data),
  remove: (id) => api.delete(`/educations/${id}`),
};
