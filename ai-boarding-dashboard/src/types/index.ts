// ============================================================================
// USER TYPES
// ============================================================================

export type UserRole = 'ADMIN' | 'CLIENT_ADMIN' | 'USER';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  role?: UserRole;
  isActive?: boolean;
}

// ============================================================================
// CLIENT TYPES
// ============================================================================

export interface Client {
  id: number;
  name: string;
  email: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateClientDto {
  name: string;
  email: string;
  phone?: string;
}

export interface UpdateClientDto {
  name?: string;
  email?: string;
  phone?: string;
  isActive?: boolean;
}

// ============================================================================
// PROJECT TYPES
// ============================================================================

export type ProjectStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Project {
  id: number;
  name: string;
  description?: string;
  clientId: number;
  clientName?: string;
  status: ProjectStatus;
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
  clientId: number;
  status: ProjectStatus;
  startDate: string;
  endDate?: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  clientId?: number;
  status?: ProjectStatus;
  startDate?: string;
  endDate?: string;
}

// ============================================================================
// AUTH TYPES
// ============================================================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

// ============================================================================
// COMPONENT TYPES
// ============================================================================

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
}