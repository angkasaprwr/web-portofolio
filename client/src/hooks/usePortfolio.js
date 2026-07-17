import { useQuery } from '@tanstack/react-query';
import {
  aboutApi,
  skillsApi,
  projectsApi,
  experiencesApi,
  certificatesApi,
  socialApi,
  cvApi,
  settingsApi,
  dashboardApi,
} from '../services/apiServices';

export const useAbout = () =>
  useQuery({ queryKey: ['about'], queryFn: async () => (await aboutApi.get()).data.data });

export const useSkills = (params = {}) =>
  useQuery({
    queryKey: ['skills', params],
    queryFn: async () => (await skillsApi.list({ all: true, ...params })).data,
  });

export const useProjects = (params = {}) =>
  useQuery({
    queryKey: ['projects', params],
    queryFn: async () => (await projectsApi.list(params)).data,
  });

export const useProjectCategories = () =>
  useQuery({
    queryKey: ['project-categories'],
    queryFn: async () => (await projectsApi.categories()).data.data,
  });

export const useProject = (slug) =>
  useQuery({
    queryKey: ['project', slug],
    queryFn: async () => (await projectsApi.getBySlug(slug)).data.data,
    enabled: !!slug,
  });

export const useExperiences = (params = {}) =>
  useQuery({
    queryKey: ['experiences', params],
    queryFn: async () => (await experiencesApi.list(params)).data,
  });

export const useExperienceCategories = () =>
  useQuery({
    queryKey: ['experience-categories'],
    queryFn: async () => (await experiencesApi.categories()).data.data,
  });

export const useCertificates = (params = {}) =>
  useQuery({
    queryKey: ['certificates', params],
    queryFn: async () => (await certificatesApi.list({ all: true, ...params })).data,
  });

export const useSocialLinks = () =>
  useQuery({
    queryKey: ['social-links'],
    queryFn: async () => (await socialApi.list()).data.data,
  });

export const useCv = () =>
  useQuery({
    queryKey: ['cv'],
    queryFn: async () => (await cvApi.getActive()).data.data,
    retry: false,
  });

export const useSettings = () =>
  useQuery({
    queryKey: ['settings'],
    queryFn: async () => (await settingsApi.list()).data.data,
  });

export const useDashboard = () =>
  useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => (await dashboardApi.overview()).data.data,
  });
