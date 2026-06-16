import { api } from './api';
import { User } from './index';

export const userService = {
  getCurrentUser: () => api.get<User>('/api/v1/users/me'),
  updateCurrentUser: (data: Partial<User>) => api.put<User>('/api/v1/users/me', data),
  getUserById: (id: string) => api.get<User>(`/api/v1/users/${id}`),
};