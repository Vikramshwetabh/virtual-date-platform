import { api } from './api';
import { Invitation } from './index';

export const invitationService = {
  getInvitations: () => api.get<Invitation[]>('/api/v1/invitations'),
  createInvitation: (data: { receiverId: string; roomId: string }) => 
    api.post<Invitation>('/api/v1/invitations', data),
  acceptInvitation: (id: string) => api.post<Invitation>(`/api/v1/invitations/${id}/accept`),
  rejectInvitation: (id: string) => api.post<Invitation>(`/api/v1/invitations/${id}/reject`),
};