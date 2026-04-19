import { apiClient } from './client';

export interface Project {
  id: string;
  name: string;
  location: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export interface ProjectCreate {
  name: string;
  location: string;
  description?: string;
}

export const getProjects = async (): Promise<Project[]> => {
  const { data } = await apiClient.get('/projects/');
  return data;
};

export const createProject = async (project: ProjectCreate): Promise<Project> => {
  const { data } = await apiClient.post('/projects/', project);
  return data;
};
