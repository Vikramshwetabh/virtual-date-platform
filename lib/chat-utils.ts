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
  console.log("3. normalizeWebSocketMessage input:", message);
  const type = message.type || message.event_type;
  const userId = message.userId || message.senderId || message.payload?.userId || message.payload?.senderId;

  if (type !== 'message' || !userId) {
    console.log("4. normalizeWebSocketMessage output: null (filtered out)");
    return null
  }

  const result = {
    id: message.payload?.id || `${message.timestamp || Date.now()}-${userId}`,
    userId: userId,
    content: message.payload?.content || '',
  };
  console.log("4. normalizeWebSocketMessage output:", result);
  return result;
}
