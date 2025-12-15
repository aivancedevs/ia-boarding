import { apiClient } from './apiClient';
import { Project, CreateProjectDto, UpdateProjectDto, ApiResponse } from '@/types';

export const getProjects = async (): Promise<Project[]> => {
  const response = await apiClient.get<ApiResponse<Project[]>>('/users/projects');
  return response.data;
};

export const getProjectsByClient = async (clientId: number): Promise<Project[]> => {
  const response = await apiClient.get<ApiResponse<Project[]>>(`/users/projects/client/${clientId}`);
  return response.data;
};

export const getProjectById = async (id: number): Promise<Project> => {
  const response = await apiClient.get<ApiResponse<Project>>(`/users/projects/${id}`);
  return response.data;
};

export const createProject = async (data: CreateProjectDto): Promise<Project> => {
  const response = await apiClient.post<ApiResponse<Project>>('/users/projects', data);
  return response.data;
};

export const updateProject = async (id: number, data: UpdateProjectDto): Promise<Project> => {
  const response = await apiClient.put<ApiResponse<Project>>(`/users/projects/${id}`, data);
  return response.data;
};

export const deleteProject = async (id: number): Promise<void> => {
  await apiClient.delete(`/users/projects/${id}`);
};