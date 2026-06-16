import { api } from './api';
import { Message } from './index';

export const chatService = {
  getRoomMessages: (roomId: string, page = 1, limit = 50) => 
    api.get<Message[]>(`/api/v1/rooms/${roomId}/messages?page=${page}&limit=${limit}`),
};