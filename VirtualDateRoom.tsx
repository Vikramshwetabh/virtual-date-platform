"use client";

import { useState, useEffect } from "react";
import { Send, Music, PauseCircle, Users } from "lucide-react";
import { useWebSocket } from "@/hooks/use-websocket";
import { chat, rooms } from "@/lib/api";

interface VirtualDateRoomProps {
  roomId: string;
}

export default function VirtualDateRoom({ roomId }: VirtualDateRoomProps) {
  const { connected, messages, send } = useWebSocket(roomId);
  const [inputText, setInputText] = useState("");
  const [roomDetails, setRoomDetails] = useState<any>(null);
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  // Load initial room state and chat history
  useEffect(() => {
    async function loadRoomData() {
      try {
        const details = await rooms.get(roomId);
        setRoomDetails(details);

        const history = await chat.getMessages(roomId);
        setChatHistory(history.messages.reverse()); // Assuming we want oldest first
      } catch (err) {
        console.error("Failed to load room data", err);
      }
    }
    loadRoomData();
  }, [roomId]);

  // Merge incoming live messages with history
  const displayMessages = [
    ...chatHistory,
    ...messages.filter((m) => m.type === "message" || m.event_type === "message")
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    send("message", { content: inputText });
    setInputText("");
  };

  const handlePlayMusic = () => {
    // Example song ID - you would typically let the user select this from the /songs endpoint
    send("music_play", { songId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11" });
  };

  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto border rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-lg">Virtual {roomDetails?.roomType || "Date"} Room</h2>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
            {connected ? "Connected" : "Disconnected"}
          </span>
        </div>
        <div className="flex gap-2">
          <button onClick={handlePlayMusic} className="p-2 hover:bg-slate-200 rounded-full transition-colors" title="Play Music">
            <Music className="w-5 h-5" />
          </button>
          <button onClick={() => send("music_pause")} className="p-2 hover:bg-slate-200 rounded-full transition-colors" title="Pause Music">
            <PauseCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 overflow-y-auto bg-white space-y-4">
        {displayMessages.map((msg, i) => (
          <div key={i} className="bg-slate-100 p-3 rounded-lg w-fit max-w-[80%]">
            <p className="text-sm">{msg.payload?.content || msg.content}</p>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t flex gap-2">
        <input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" disabled={!connected} className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50">
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}