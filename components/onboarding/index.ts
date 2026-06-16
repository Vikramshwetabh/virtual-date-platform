export interface User {
  id: string;
  email: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  interests?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Room {
  id: string;
  name: string;
  environmentType: string;
  status: string;
  createdAt: string;
}

export interface RoomMember {
  id: string;
  roomId: string;
  userId: string;
  user: User;
  joinedAt: string;
}

export interface Invitation {
  id: string;
  senderId: string;
  receiverId: string;
  roomId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  sender: User;
  room: Room;
}

export interface Message {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  createdAt: string;
}