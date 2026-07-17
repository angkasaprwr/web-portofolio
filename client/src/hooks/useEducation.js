import { useQuery } from '@tanstack/react-query';
import { educationsApi } from '../services/educationApi';

export const useEducations = (params = {}) =>
  useQuery({
    queryKey: ['educations', params],
    queryFn: async () => (await educationsApi.list(params)).data.data,
  });
