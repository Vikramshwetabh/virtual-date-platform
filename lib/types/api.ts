export type EnvironmentType = 'coffee' | 'library' | 'park' | 'gallery' | 'beach'

export type SecondDateChoice = 'yes' | 'maybe' | 'no'

export interface ApiUser {
  id: string
  name: string
  email: string
  avatar?: string | null
  bio?: string
  created_at?: string
}

export interface ApiInvitation {
  id: string
  senderId: string
  receiverId: string
  environmentType: EnvironmentType
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
  roomId: string | null
}

export interface ApiInvitationsResponse {
  invitations: ApiInvitation[]
}

export interface ApiRoom {
  id: string
  roomType: EnvironmentType
  status: string
  createdBy?: string
  createdAt: string
  members?: ApiRoomMember[]
}

export interface ApiRoomMember {
  userId: string
  name: string
  avatar?: string | null
  joinedAt: string
}

export interface ApiChatMessage {
  id: string
  userId: string
  content: string
  createdAt: string
}

export interface ApiMatchOutcome {
  id?: string
  roomId?: string
  user1Choice?: SecondDateChoice
  user2Choice?: SecondDateChoice
  mutualMatch: boolean
  createdAt?: string
}

export interface EnrichedInvitation extends ApiInvitation {
  sender?: Pick<ApiUser, 'id' | 'name' | 'avatar' | 'bio'>
}
