import { api } from './api';
import { AuthResponse } from './index';

export const authService = {
  login: (data: any) => api.post<AuthResponse>('/api/v1/auth/login', data),
  signup: (data: any) => api.post<AuthResponse>('/api/v1/auth/signup', data),
  me: () => api.get<any>('/api/v1/auth/me'),
};