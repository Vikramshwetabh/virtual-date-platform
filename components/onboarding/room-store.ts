import { create } from 'zustand';
import { Room, RoomMember } from './index';
import { roomService } from './room.service';

interface RoomState {
  currentRoom: Room | null;
  members: RoomMember[];
  loading: boolean;
  fetchRoom: (id: string) => Promise<void>;
  fetchMembers: (id: string) => Promise<void>;
}

export const useRoomStore = create<RoomState>((set) => ({
  currentRoom: null,
  members: [],
  loading: false,

  fetchRoom: async (id) => {
    set({ loading: true });
    try {
      const room = await roomService.getRoomById(id);
      set({ currentRoom: room, loading: false });
    } catch (error) {
      set({ loading: false });
    }
  },

  fetchMembers: async (id) => {
    set({ loading: true });
    try {
      const members = await roomService.getRoomMembers(id);
      set({ members, loading: false });
    } catch (error) {
      set({ loading: false });
    }
  }
}));