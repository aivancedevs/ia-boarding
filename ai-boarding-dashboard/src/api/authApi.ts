import { apiClient } from './apiClient';
import { LoginCredentials, AuthResponse } from '@/types';

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  return apiClient.post<AuthResponse>('/auth/login', credentials);
};

export const logout = async (): Promise<void> => {
  return apiClient.post<void>('/auth/logout');
};