import { api } from './api';
import { Room, RoomMember } from './index';

export const roomService = {
  createRoom: (data: { name: string; environmentType: string }) => api.post<Room>('/api/v1/rooms', data),
  getRoomById: (id: string) => api.get<Room>(`/api/v1/rooms/${id}`),
  getRoomMembers: (id: string) => api.get<RoomMember[]>(`/api/v1/rooms/${id}/members`),
};