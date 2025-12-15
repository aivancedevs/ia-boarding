import { apiClient } from './apiClient';
import { Client, CreateClientDto, UpdateClientDto, ApiResponse } from '@/types';

export const getClients = async (): Promise<Client[]> => {
  const response = await apiClient.get<ApiResponse<Client[]>>('/users/clients');
  return response.data;
};

export const getClientById = async (id: number): Promise<Client> => {
  const response = await apiClient.get<ApiResponse<Client>>(`/users/clients/${id}`);
  return response.data;
};

export const createClient = async (data: CreateClientDto): Promise<Client> => {
  const response = await apiClient.post<ApiResponse<Client>>('/users/clients', data);
  return response.data;
};

export const updateClient = async (id: number, data: UpdateClientDto): Promise<Client> => {
  const response = await apiClient.put<ApiResponse<Client>>(`/users/clients/${id}`, data);
  return response.data;
};

export const deleteClient = async (id: number): Promise<void> => {
  await apiClient.delete(`/users/clients/${id}`);
};