'use client';

import { use, useEffect } from 'react';
import { useSocket } from '@/components/onboarding/useSocket';
import { useChat } from '@/components/onboarding/useChat';
// Replace with the actual import path to your existing Active Date Room UI
// import { ActiveDateRoomView } from '@/components/date/active-date-room-view';

export default function ActiveDateRoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  // Unwrap the dynamic route params
  const { roomId } = use(params);
  
  // Initialize WebSocket connection globally for this room
  const { socket } = useSocket();
  
  // Connect chat history and real-time typing events to this specific room ID
  const chat = useChat(roomId);

  return (
    <div className="flex h-full w-full flex-col">
      {/* <ActiveDateRoomView roomId={roomId} chat={chat} /> */}
    </div>
  );
}