'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import {
  Clock,
  Mic,
  MicOff,
  MoreHorizontal,
  Music,
  Pause,
  PhoneOff,
  Play,
  Send,
  Settings,
  Video,
  VideoOff,
  Wifi,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useWebSocket } from '@/hooks/use-websocket'
import { chat, rooms, music as musicApi, feedback } from '@/lib/api'
import { normalizeHttpMessage, normalizeWebSocketMessage, type DisplayChatMessage } from '@/lib/chat-utils'
import { FeedbackModal } from '@/components/dashboard/feedback-modal'
import { MatchOutcomeModal } from '@/components/dashboard/match-outcome-modal'
import { toast } from 'sonner'

export function ActiveDateView({ roomId }: { roomId: string }) {
  const router = useRouter();
  const [roomDetails, setRoomDetails] = useState<any>(null);
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [message, setMessage] = useState('')
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isOutcomeModalOpen, setIsOutcomeModalOpen] = useState(false);
  const [outcomeData, setOutcomeData] = useState<any>(null)
  const [audioOffset, setAudioOffset] = useState<number>(0);

  const { connected, messages, send } = useWebSocket(roomId)
  const [chatHistory, setChatHistory] = useState<DisplayChatMessage[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function loadRoomData() {
      if (!roomId) return;
      try {
        try {
          await rooms.join(roomId);
        } catch (joinErr: any) {
          // Safe to ignore if already joined (409)
        }
        
        const [details, history, musicState] = await Promise.all([
          rooms.get(roomId),
          chat.getMessages(roomId),
          musicApi.getRoomState(roomId)
        ]);
        setRoomDetails(details);
        if (history?.messages) {
          setChatHistory(history.messages.map(normalizeHttpMessage))
        }
        
        if (musicState?.isPlaying) {
          setIsPlaying(true);
          if (musicState.startedAt) {
            setAudioOffset(Math.max(0, (Date.now() - new Date(musicState.startedAt).getTime()) / 1000));
          }
        } else {
          setIsPlaying(false);
        }
      } catch (e: any) {
        console.error("Failed to load room data", e);
        toast.error(e.message || "Failed to load room data");
      }
    }
    loadRoomData();
  }, [roomId]);

  // Listen for Match Outcome
  useEffect(() => {
    const outcomeMessage = messages.find(m => m.type === "match:outcome" && m.roomId === roomId);
    if (outcomeMessage && !isOutcomeModalOpen) {
      setOutcomeData(outcomeMessage.payload);
      setIsOutcomeModalOpen(true);
    }
  }, [messages, isOutcomeModalOpen, roomId]);

  // Listen for Music Events
  useEffect(() => {
    const latestMsg = messages[messages.length - 1];
    if (latestMsg?.type === "music:play") {
      setIsPlaying(true);
      if (latestMsg.payload?.startedAt) {
        setAudioOffset(Math.max(0, (Date.now() - new Date(latestMsg.payload.startedAt).getTime()) / 1000));
      } else {
        setAudioOffset(0);
      }
    }
    if (latestMsg?.type === "music:pause") {
      setIsPlaying(false);
    }
  }, [messages]);

  const handleFeedbackSubmitted = async () => {
    setIsFeedbackModalOpen(false);
    toast.info("Waiting for your match to submit feedback...", { duration: 5000 });

    const checkOutcome = async () => {
      try {
        const outcome = await feedback.getOutcome(roomId);
        if (outcome && outcome.mutualMatch !== undefined) {
          setOutcomeData(outcome);
          setIsOutcomeModalOpen(true);
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        }
      } catch (error) {
        // Ignore errors while polling (e.g., 404 when match hasn't submitted)
      }
    };

    await checkOutcome();
    pollIntervalRef.current = setInterval(checkOutcome, 10000);
  };

  useEffect(() => {
    if (isOutcomeModalOpen && pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
  }, [isOutcomeModalOpen]);

  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  const handleLeaveRoom = async () => {
    try {
      await rooms.leave(roomId);
    } catch (e: any) {
      toast.error(e.message || "Failed to leave room properly");
    }
    setIsFeedbackModalOpen(true);
  };

  const handleTyping = (val: string) => {
    setMessage(val)
  };

  // Prevent Ghost Users on unexpected navigation
  useEffect(() => {
    const handleUnload = () => {
      try {
        const authStorage = localStorage.getItem("auth-storage");
        const token = authStorage ? JSON.parse(authStorage).state.token : null;
        if (token) {
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://virtual-date-api.onrender.com/api/v1";
          fetch(`${baseUrl}/rooms/${roomId}/leave`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            keepalive: true
          }).catch(() => {});
        }
      } catch(e) {}
    };
    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('pagehide', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('pagehide', handleUnload);
    };
  }, [roomId]);

  const otherUser = roomDetails?.members?.find((m: any) => m.userId !== localStorage.getItem('userId'));

  // Combine history with live messages, avoiding duplicates
  const liveMessages = messages
    .map(normalizeWebSocketMessage)
    .filter((message): message is NonNullable<typeof message> => message !== null)
    .filter((message) => !chatHistory.some((historyMessage) => historyMessage.id === message.id))

  const displayMessages = [...chatHistory, ...liveMessages]

  // Auto Scroll logic
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [displayMessages])

  return (
    <>
      <FeedbackModal
        roomId={roomId}
        isOpen={isFeedbackModalOpen}
        onOpenChange={setIsFeedbackModalOpen}
        onFeedbackSubmitted={handleFeedbackSubmitted}
      />
      <MatchOutcomeModal
        outcome={outcomeData}
        isOpen={isOutcomeModalOpen}
        onOpenChange={setIsOutcomeModalOpen}
        otherUser={otherUser}
      />

    <div className="dark flex h-screen w-full flex-col overflow-hidden bg-background text-foreground md:flex-row">
      {/* Main Area */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        {/* Environment Background */}
        <div className="absolute inset-0 z-0 bg-black">
          <Image
            src="/images/env-coffee.png"
            alt="Coffee Shop Environment"
            fill
            className="object-cover opacity-50 blur-[4px]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/20 to-background/90" />
        </div>

        {/* Top Bar */}
        <header className="relative z-10 flex items-center justify-between p-4 md:p-6">
          <div className="flex items-center gap-3">
            <Badge
              variant="secondary"
              className="border-border/50 bg-background/50 px-3 py-1.5 text-xs font-medium backdrop-blur-md"
            >
              <span className="mr-2 flex size-2 animate-pulse rounded-full bg-green-500" />
              Coffee Shop Date
            </Badge>
            <Badge
              variant="outline"
              className="border-border/50 bg-background/50 px-3 py-1.5 font-mono text-xs backdrop-blur-md"
            >
              <Clock className="mr-2 size-3.5" />
              00:12:45
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`border-border/50 bg-background/50 backdrop-blur-md ${connected ? 'text-green-500' : 'text-red-500'}`}
            >
              <Wifi className={`mr-1.5 size-3.5 ${connected ? 'text-green-500' : 'text-red-500'}`} />
              {connected ? "Connected" : "Reconnecting..."}
            </Badge>
          </div>
        </header>

        {/* Environment Scene (Avatars & Center Glow) */}
        <div className="relative z-10 flex flex-1 items-center justify-center p-6">
          <div className="flex w-full max-w-4xl items-center justify-between gap-4 md:gap-8">
            
            {/* User Avatar */}
            <div className="group flex flex-col items-center gap-4">
              <div className="relative flex size-32 items-center justify-center rounded-full border-4 border-primary/20 bg-background/50 p-1 shadow-2xl backdrop-blur-sm transition-transform duration-300 hover:scale-105 md:size-48">
                <Image
                  src="/images/avatar-a.png"
                  alt="You"
                  fill
                  className="rounded-full object-cover"
                />
                <div className="absolute bottom-1 right-1 rounded-full border border-border bg-background p-1.5 shadow-lg">
                  {isMuted ? (
                    <MicOff className="size-4 text-destructive" />
                  ) : (
                    <Mic className="size-4 text-green-500" />
                  )}
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-heading text-lg font-semibold tracking-tight text-white">
                  You
                </h3>
                <p className="text-xs text-white/60">Online</p>
              </div>
            </div>

            {/* Center Information */}
            <div className="relative hidden flex-1 flex-col items-center justify-center md:flex">
              <div className="absolute size-40 animate-pulse rounded-full bg-primary/20 blur-[60px]" />
              <div className="z-10 text-center">
                <h2 className="font-heading text-3xl font-bold tracking-tight text-white/90">
                  Coffee Shop Date
                </h2>
                <p className="mt-2 text-sm text-white/60">
                  Relax, chat, and enjoy your first virtual date
                </p>
              </div>
            </div>

            {/* Match Avatar */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative flex size-32 items-center justify-center rounded-full border-4 border-primary/50 bg-background/50 p-1 shadow-2xl shadow-primary/20 backdrop-blur-sm transition-transform duration-300 hover:scale-105 md:size-48">
                <Image
                  src={otherUser?.avatar || "/images/avatar-b.png"}
                  alt="Maya"
                  fill
                  className="rounded-full object-cover"
                />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-primary/30 bg-primary/20 px-3 py-1 backdrop-blur-md">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-primary-foreground">
                    <div className="size-1.5 animate-pulse rounded-full bg-green-400" />
                    Speaking
                  </span>
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-heading text-lg font-semibold tracking-tight text-white">
                  {otherUser?.name || "Match"}
                </h3>
                <p className="text-xs text-white/60">Online</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-6 p-6 pb-8 md:flex-row md:justify-between">
          <div className="hidden w-40 md:block" /> {/* Spacer */}

          <div className="flex items-center rounded-full border border-border/50 bg-background/50 p-2 shadow-xl backdrop-blur-xl">
            <Button
              variant={isMuted ? 'destructive' : 'ghost'}
              size="icon"
              className="rounded-full"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <MicOff className="size-5" /> : <Mic className="size-5" />}
            </Button>
            <div className="mx-2 h-6 w-px bg-border/50" />
            <Button
              variant={isVideoOff ? 'destructive' : 'ghost'}
              size="icon"
              className="rounded-full"
              onClick={() => setIsVideoOff(!isVideoOff)}
            >
              {isVideoOff ? <VideoOff className="size-5" /> : <Video className="size-5" />}
            </Button>
            <div className="mx-2 h-6 w-px bg-border/50" />
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="size-5 text-muted-foreground" />
            </Button>
          </div>

          <div className="flex w-40 justify-end">
            <Button
              variant="destructive"
              className="rounded-full px-6 font-semibold shadow-lg shadow-destructive/20 transition-transform hover:scale-105"
              onClick={handleLeaveRoom}
            >
              <PhoneOff className="mr-2 size-4" />
              Leave Date
            </Button>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="z-20 flex w-full flex-col border-l border-border/50 bg-card/60 backdrop-blur-2xl md:w-[380px]">
        {/* Music Card */}
        <div className="border-b border-border/50 p-5">
          <h4 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Music className="size-3.5" /> Shared Audio
          </h4>
          <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-background/50 p-3 shadow-sm">
            <div className="relative size-14 overflow-hidden rounded-xl bg-muted">
              <Image
                src="/placeholder.svg"
                alt="Album Art"
                fill
                className="object-cover opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <Music className="size-5 text-white/70" />
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <h5 className="truncate text-sm font-semibold text-foreground">
                Lo-Fi Cafe Vibes
              </h5>
              <p className="truncate text-xs text-muted-foreground">
                Chillhop Music {audioOffset > 0 && `(Sync: +${Math.floor(audioOffset)}s)`}
              </p>
            </div>
            <Button
              variant="secondary"
              size="icon"
              className="size-10 rounded-full bg-primary/10 text-primary hover:bg-primary/20"
              onClick={async () => {
                if (isPlaying) {
                  await musicApi.pause(roomId);
                } else {
                  // In a real app, you'd get a songId from a selection or GET /songs
                  await musicApi.play(roomId, "550e8400-e29b-41d4-a716-446655440003");
                }
                setIsPlaying(!isPlaying);
              }}
            >
              {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
            </Button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-border/50 p-5">
            <h4 className="font-heading text-sm font-semibold">Live Chat</h4>
            <Button variant="ghost" size="icon" className="size-8 rounded-full">
              <MoreHorizontal className="size-4 text-muted-foreground" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-5">
            {displayMessages.map((msg) => {
              const currentUserId = typeof window !== 'undefined' ? localStorage.getItem("userId") : null;
              const isMe = msg.userId === currentUserId;
              return (
                <div key={msg.id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
                  <Avatar className="size-8 border border-border/50 shadow-sm">
                    <AvatarImage src={isMe ? roomDetails?.members.find((m:any) => m.userId === currentUserId)?.avatar || "/images/avatar-a.png" : otherUser?.avatar || "/images/avatar-b.png"} />
                    <AvatarFallback>{isMe ? "Y" : otherUser?.name.charAt(0) || "M"}</AvatarFallback>
                  </Avatar>
                  <div className={`flex max-w-[80%] flex-col ${isMe ? "items-end" : ""} gap-1.5`}>
                    <div className={`flex items-baseline gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
                      <span className="text-sm font-medium">{isMe ? "You" : otherUser?.name || "Match"}</span>
                    </div>
                    <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${isMe ? "rounded-tr-none bg-primary text-primary-foreground shadow-sm" : "rounded-tl-none bg-secondary/60 text-secondary-foreground"}`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border/50 bg-background/40 p-5 backdrop-blur-sm">
            <form
              className="relative flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                if (message.trim()) {
                  send("chat:send", { content: message.trim() });
                  setMessage('')
                }
              }}
            >
              <Input
                value={message}
                onChange={(e) => handleTyping(e.target.value)}
                placeholder="Type a message..."
                className="h-11 rounded-full border-border/50 bg-secondary/40 pr-12 focus-visible:ring-primary/50"
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="absolute right-1 size-9 rounded-full text-primary hover:bg-primary/10 hover:text-primary"
                disabled={!message.trim()}
              >
                <Send className="size-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}