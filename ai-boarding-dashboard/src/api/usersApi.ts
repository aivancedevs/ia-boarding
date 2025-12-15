import { apiClient } from './apiClient';
import { User, CreateUserDto, UpdateUserDto, ApiResponse } from '@/types';

export const getUsers = async (): Promise<User[]> => {
  const response = await apiClient.get<ApiResponse<User[]>>('/users');
  return response.data;
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
  return response.data;
};

export const createUser = async (data: CreateUserDto): Promise<User> => {
  const response = await apiClient.post<ApiResponse<User>>('/users', data);
  return response.data;
};

export const updateUser = async (id: number, data: UpdateUserDto): Promise<User> => {
  const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await apiClient.delete(`/users/${id}`);
};

export const updateUserRole = async (id: number, role: string): Promise<User> => {
  const response = await apiClient.patch<ApiResponse<User>>(`/users/${id}/role`, { role });
  return response.data;
};