import type { WebSocketMessage } from '@/hooks/use-websocket'
import type { ApiChatMessage } from '@/lib/types/api'

export type DisplayChatMessage = {
  id: string
  userId: string
  content: string
}

export function normalizeHttpMessage(message: ApiChatMessage): DisplayChatMessage {
  return {
    id: message.id,
    userId: message.userId,
    content: message.content,
  }
}

export function normalizeWebSocketMessage(message: WebSocketMessage): DisplayChatMessage | null {
  if (message.type !== 'chat:send' || !message.userId) {
    return null
  }

  return {
    id: message.payload?.id || `${message.timestamp || Date.now()}-${message.userId}`,
    userId: message.userId,
    content: message.payload?.content || '',
  }
}
