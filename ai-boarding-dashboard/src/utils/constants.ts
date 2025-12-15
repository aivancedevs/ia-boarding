export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'AI Boarding Dashboard';

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/app/dashboard',
  USERS: '/app/users',
  CLIENTS: '/app/clients',
  PROJECTS: '/app/projects',
  PROFILE: '/app/profile',
} as const;

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  CLIENT_ADMIN: 'CLIENT_ADMIN',
  USER: 'USER',
} as const;

export const USER_ROLE_LABELS = {
  ADMIN: 'Administrador',
  CLIENT_ADMIN: 'Administrador de Cliente',
  USER: 'Usuario',
} as const;

export const PROJECT_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export const PROJECT_STATUS_LABELS = {
  PENDING: 'Pendiente',
  IN_PROGRESS: 'En Progreso',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
} as const;

export const PROJECT_STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
} as const;

export const TOKEN_KEY = 'auth_token';
export const USER_KEY = 'auth_user';