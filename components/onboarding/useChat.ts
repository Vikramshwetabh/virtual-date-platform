import { useEffect, useState, useCallback } from 'react';
import { socketClient } from './socket';
import { useChatStore } from './chat-store';

export function useChat(roomId: string) {
  const { messages, addMessage, fetchMessages, loading, hasMore } = useChatStore();
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!roomId) return;
    fetchMessages(roomId);

    const handleMessage = (message: any) => {
      if (message.roomId === roomId) addMessage(message);
    };

    const handleTypingStart = (data: { userId: string; roomId: string }) => {
      if (data.roomId === roomId) {
        setTypingUsers((prev) => Array.from(new Set([...prev, data.userId])));
      }
    };

    const handleTypingStop = (data: { userId: string; roomId: string }) => {
      if (data.roomId === roomId) {
        setTypingUsers((prev) => prev.filter((id) => id !== data.userId));
      }
    };

    socketClient.on('message', handleMessage);
    socketClient.on('typing_start', handleTypingStart);
    socketClient.on('typing_stop', handleTypingStop);

    return () => {
      socketClient.off('message', handleMessage);
      socketClient.off('typing_start', handleTypingStart);
      socketClient.off('typing_stop', handleTypingStop);
    };
  }, [roomId, fetchMessages, addMessage]);

  return {
    messages,
    loading,
    hasMore,
    typingUsers,
    sendMessage: useCallback((content: string) => socketClient.send('message', { roomId, content }), [roomId]),
    sendTypingStart: useCallback(() => socketClient.send('typing_start', { roomId }), [roomId]),
    sendTypingStop: useCallback(() => socketClient.send('typing_stop', { roomId }), [roomId]),
    loadMore: () => {
      if (!loading && hasMore) fetchMessages(roomId, useChatStore.getState().page + 1);
    }
  };
}