import { create } from 'zustand';
import { Message } from './index';
import { chatService } from './chat.service';

interface ChatState {
  messages: Message[];
  loading: boolean;
  hasMore: boolean;
  page: number;
  fetchMessages: (roomId: string, page?: number) => Promise<void>;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  loading: false,
  hasMore: true,
  page: 1,

  fetchMessages: async (roomId, page = 1) => {
    set({ loading: true });
    try {
      const limit = 50;
      const newMessages = await chatService.getRoomMessages(roomId, page, limit);
      set((state) => ({
        messages: page === 1 ? newMessages : [...newMessages, ...state.messages],
        loading: false,
        hasMore: newMessages.length === limit,
        page,
      }));
    } catch (error) {
      set({ loading: false });
    }
  },

  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  
  clearMessages: () => set({ messages: [], page: 1, hasMore: true }),
}));