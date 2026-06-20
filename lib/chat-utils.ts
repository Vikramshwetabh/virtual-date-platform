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

  // Persist the generated id on the message object itself to make it stable across renders
  if (!(message as any)._normalizedId) {
    (message as any)._normalizedId = message.payload?.id || message.timestamp || `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  }

  const result = {
    id: (message as any)._normalizedId,
    userId: userId,
    content: message.payload?.content || message.content || '',
  };
  console.log("4. normalizeWebSocketMessage output:", result);
  return result;
}
