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
import { useAuthStore } from '@/store/auth-store'
import { toast } from 'sonner'

export function ActiveDateView({ roomId }: { roomId: string }) {
  const router = useRouter()
  const { user } = useAuthStore()
  
  const [roomDetails, setRoomDetails] = useState<any>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [message, setMessage] = useState('')
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)
  const [isOutcomeModalOpen, setIsOutcomeModalOpen] = useState(false)
  const [outcomeData, setOutcomeData] = useState<any>(null)
  const [audioOffset, setAudioOffset] = useState<number>(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [songs, setSongs] = useState<any[]>([])
  const [selectedSong, setSelectedSong] = useState<any>(null)
  const [currentSongId, setCurrentSongId] = useState<string | null>(null)

  // Mobile responsiveness tab: 'scene' or 'chat'
  const [mobileTab, setMobileTab] = useState<'scene' | 'chat'>('scene')

  const { connected, messages, send, reconnect } = useWebSocket(roomId)

  const [chatHistory, setChatHistory] = useState<DisplayChatMessage[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const isInitialLoadRef = useRef(true)
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Leave room when navigating away/unmounting
  useEffect(() => {
    return () => {
      if (roomId) {
        rooms.leave(roomId).catch(() => {})
      }
    }
  }, [roomId])

  useEffect(() => {
    async function loadRoomData() {
      if (!roomId) return
      try {
        try {
          await rooms.join(roomId)
        } catch (joinErr: any) {
          // Safe to ignore if already joined (409)
        }
        
        const [details, history, musicState, songData] = await Promise.all([
          rooms.get(roomId),
          chat.getMessages(roomId),
          musicApi.getRoomState(roomId),
          musicApi.getSongs().catch(() => ({ songs: [] }))
        ])
        console.log("ROOM_STATE_MUSIC", musicState)
        setRoomDetails(details)
        if (history?.messages) {
          setChatHistory(history.messages.map(normalizeHttpMessage))
        }

        const songList = songData?.songs || []
        setSongs(songList)
        if (songList.length > 0) {
          setSelectedSong(songList[0])
        }
        
        if (musicState?.isPlaying) {
          setIsPlaying(true)
          setCurrentSongId(musicState.songId || null)
          if (musicState.startedAt) {
            setAudioOffset(Math.max(0, (Date.now() - new Date(musicState.startedAt).getTime()) / 1000))
          }
        } else {
          setIsPlaying(false)
        }
      } catch (e: any) {
        console.error("Failed to load room data", e)
        toast.error(e.message || "Failed to load room data")
      }
    }
    loadRoomData()
  }, [roomId])

  // Listen for Match Outcome
  useEffect(() => {
    const outcomeMessage = messages.find(m => (m.type === "match_outcome_ready" || m.event_type === "match_outcome_ready") && m.roomId === roomId)
    if (outcomeMessage && !isOutcomeModalOpen) {
      setOutcomeData(outcomeMessage.payload)
      setIsOutcomeModalOpen(true)
    }
  }, [messages, isOutcomeModalOpen, roomId])

  // Listen for Music Events
  useEffect(() => {
    const latestMsg = messages[messages.length - 1]
    const latestMsgType = latestMsg?.type || latestMsg?.event_type
    if (latestMsgType === "music_started") {
      console.log("MUSIC_STARTED_RECEIVED")
      console.log("MUSIC_STARTED_EVENT", latestMsg)
      setIsPlaying(true)
      setCurrentSongId(latestMsg.payload?.songId || latestMsg.payload?.song_id || null)
      if (latestMsg.payload?.startedAt) {
        setAudioOffset(Math.max(0, (Date.now() - new Date(latestMsg.payload.startedAt).getTime()) / 1000))
      } else {
        setAudioOffset(0)
      }
    } else if (latestMsgType === "music_paused") {
      setIsPlaying(false)
    }
  }, [messages])

  // Synchronize actual audio element with React play/pause and offset state
  useEffect(() => {
    if (!audioRef.current) return
    
    if (isPlaying) {
      console.log("AUDIO_PLAY_CALLED")
      const targetTime = audioOffset
      if (Math.abs(audioRef.current.currentTime - targetTime) > 1.5) {
        audioRef.current.currentTime = targetTime
      }
      
      audioRef.current.play().catch(err => {
        console.warn("Audio autoplay blocked by browser policy:", err)
      })
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying, audioOffset])

  const handleFeedbackSubmitted = async () => {
    setIsFeedbackModalOpen(false)
    toast.info("Waiting for your match to submit feedback...", { duration: 5000 })

    const checkOutcome = async () => {
      try {
        const outcome = await feedback.getOutcome(roomId)
        if (outcome && outcome.mutualMatch !== undefined) {
          setOutcomeData(outcome)
          setIsOutcomeModalOpen(true)
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
        }
      } catch (error) {
        // Ignore errors while polling (e.g., 404 when match hasn't submitted)
      }
    }

    await checkOutcome()
    pollIntervalRef.current = setInterval(checkOutcome, 10000)
  }

  useEffect(() => {
    if (isOutcomeModalOpen && pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
    }
  }, [isOutcomeModalOpen])

  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
    }
  }, [])

  const handleLeaveRoom = async () => {
    try {
      await rooms.leave(roomId)
    } catch (e: any) {
      toast.error(e.message || "Failed to leave room properly")
    }
    setIsFeedbackModalOpen(true)
  }

  const handleTyping = (val: string) => {
    setMessage(val)
  }

  // Prevent Ghost Users on unexpected navigation
  useEffect(() => {
    const handleUnload = () => {
      try {
        const authStorage = localStorage.getItem("auth-storage")
        const token = authStorage ? JSON.parse(authStorage).state.token : null
        if (token) {
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://virtual-date-api.onrender.com/api/v1"
          fetch(`${baseUrl}/rooms/${roomId}/leave`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            keepalive: true
          }).catch(() => {})
        }
      } catch (e) {}
    }
    window.addEventListener('beforeunload', handleUnload)
    window.addEventListener('pagehide', handleUnload)
    return () => {
      window.removeEventListener('beforeunload', handleUnload)
      window.removeEventListener('pagehide', handleUnload)
    }
  }, [roomId])

  const otherUser = roomDetails?.members?.find((m: any) => m.userId !== user?.id)

  // Combine history with live messages, avoiding duplicates
  const liveMessages = messages
    .map(normalizeWebSocketMessage)
    .filter((message): message is NonNullable<typeof message> => message !== null)
    .filter((message) => !chatHistory.some((historyMessage) => historyMessage.id === message.id))

  // Deduplicate live messages within themselves
  const uniqueLiveMessages: DisplayChatMessage[] = []
  liveMessages.forEach((msg) => {
    if (!uniqueLiveMessages.some((m) => m.id === msg.id)) {
      uniqueLiveMessages.push(msg)
    }
  })

  const displayMessages = [...chatHistory, ...uniqueLiveMessages]

  const currentSong = songs.find(s => s.id === currentSongId) || (songs.length > 0 ? songs[0] : null)

  // Auto Scroll preservation logic
  useEffect(() => {
    const container = chatContainerRef.current
    if (!container) return

    if (isInitialLoadRef.current && displayMessages.length > 0) {
      container.scrollTop = container.scrollHeight
      isInitialLoadRef.current = false
      return
    }

    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight <= 150
    if (isAtBottom) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      })
    }
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
      <audio
        ref={audioRef}
        src={currentSong?.url || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"}
        preload="auto"
        loop
      />

      <div className="dark flex h-[100dvh] w-full flex-col overflow-hidden bg-[#120f1a] text-foreground md:flex-row animate-fade-in-up">
        {/* Main Area */}
        <div className={`relative flex-1 flex-col overflow-hidden ${mobileTab === 'scene' ? 'flex' : 'hidden md:flex'}`}>
          {/* Environment Background */}
          <div className="absolute inset-0 z-0 bg-black">
            <Image
              src="/images/env-coffee.png"
              alt="Coffee Shop Environment"
              fill
              className="object-cover opacity-45 blur-[6px] scale-105 transition-transform duration-1000"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#120f1a]/95 via-black/20 to-[#120f1a]/95" />
          </div>

          {/* Top Bar */}
          <header className="relative z-10 flex items-center justify-between p-4 md:p-6">
            <div className="flex items-center gap-3">
              <Badge
                variant="secondary"
                className="border-primary/20 bg-[#120f1a]/60 px-3.5 py-2 text-xs font-bold backdrop-blur-md text-primary"
              >
                <span className="mr-2 flex size-2.5 animate-pulse rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                Coffee Shop Date
              </Badge>
              <Badge
                variant="outline"
                className="border-white/5 bg-[#120f1a]/60 px-3.5 py-2 font-mono text-xs text-muted-foreground backdrop-blur-md"
              >
                <Clock className="mr-2 size-3.5 text-accent" />
                00:12:45
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`border-white/5 bg-[#120f1a]/60 px-3.5 py-2 backdrop-blur-md text-xs font-semibold ${connected ? 'text-green-400' : 'text-red-400'}`}
              >
                <Wifi className={`mr-2 size-3.5 ${connected ? 'text-green-400 animate-pulse' : 'text-red-400'}`} />
                {connected ? "Connected" : "Disconnected"}
              </Badge>
              {!connected && (
                <Button
                  variant="outline"
                  size="xs"
                  className="h-8 border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-white px-2.5 rounded-lg text-xs"
                  onClick={reconnect}
                >
                  Reconnect
                </Button>
              )}
            </div>
          </header>

          {/* Environment Scene (Avatars & Center Glow) */}
          <div className="relative z-10 flex flex-1 items-center justify-center p-6">
            <div className="flex w-full max-w-4xl items-center justify-between gap-4 md:gap-8">
              
              {/* User Avatar */}
              <div className="group flex flex-col items-center gap-4">
                <div className="relative flex size-28 items-center justify-center rounded-full border-4 border-white/5 bg-secondary/35 p-1 shadow-2xl backdrop-blur-md transition-transform duration-300 hover:scale-105 md:size-44">
                  <div className="relative size-full overflow-hidden rounded-full border-2 border-white/10">
                    <Image
                      src="/images/avatar-a.png"
                      alt="You"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute bottom-1 right-1 rounded-full border border-white/10 bg-[#120f1a] p-2 shadow-lg">
                    {isMuted ? (
                      <MicOff className="size-4.5 text-destructive" />
                    ) : (
                      <Mic className="size-4.5 text-green-400" />
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="font-heading text-base font-bold tracking-tight text-white md:text-lg">
                    You
                  </h3>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-green-400">Online</p>
                </div>
              </div>

              {/* Center Information */}
              <div className="relative hidden flex-1 flex-col items-center justify-center md:flex animate-float">
                <div className="absolute size-44 animate-pulse rounded-full bg-primary/10 blur-[80px] animate-pulse-slow" />
                <div className="z-10 text-center bg-black/40 border border-white/5 p-6 rounded-3xl backdrop-blur-md">
                  <h2 className="font-heading text-2xl font-extrabold tracking-tight text-white">
                    Coffee Shop Date
                  </h2>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed max-w-[200px]">
                    Relax, chat, and enjoy your first virtual date
                  </p>
                </div>
              </div>

              {/* Match Avatar */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative flex size-28 items-center justify-center rounded-full border-4 border-primary/20 bg-secondary/35 p-1 shadow-2xl shadow-primary/10 backdrop-blur-md transition-transform duration-300 hover:scale-105 md:size-44">
                  <div className="relative size-full overflow-hidden rounded-full border-2 border-white/10 animate-pulse-slow">
                    <Image
                      src={otherUser?.avatar || "/images/avatar-b.png"}
                      alt="Match avatar"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 rounded-full border border-primary/30 bg-primary/20 px-3 py-1.5 backdrop-blur-md shadow-md">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      <div className="size-1.5 animate-pulse rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.6)]" />
                      Speaking
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="font-heading text-base font-bold tracking-tight text-white md:text-lg">
                    {otherUser?.name || "Match"}
                  </h3>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-green-400">Online</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="relative z-10 flex flex-col items-center justify-center gap-4 p-4 pb-6 md:flex-row md:justify-between md:p-6 md:pb-8">
            <div className="hidden w-40 md:block" /> {/* Spacer */}

            <div className="flex items-center rounded-full border border-white/5 bg-[#120f1a]/80 p-2 shadow-2xl backdrop-blur-xl">
              <Button
                variant={isMuted ? 'destructive' : 'ghost'}
                size="icon"
                className="rounded-full size-11 hover:scale-105 transition-transform"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <MicOff className="size-5" /> : <Mic className="size-5" />}
              </Button>
              <div className="mx-2.5 h-6 w-px bg-white/5" />
              <Button
                variant={isVideoOff ? 'destructive' : 'ghost'}
                size="icon"
                className="rounded-full size-11 hover:scale-105 transition-transform"
                onClick={() => setIsVideoOff(!isVideoOff)}
              >
                {isVideoOff ? <VideoOff className="size-5" /> : <Video className="size-5" />}
              </Button>
              <div className="mx-2.5 h-6 w-px bg-white/5" />
              <Button variant="ghost" size="icon" className="rounded-full size-11 hover:scale-105 transition-transform">
                <Settings className="size-5 text-muted-foreground" />
              </Button>
            </div>

            <div className="flex w-full justify-center md:w-40 md:justify-end">
              <Button
                variant="destructive"
                className="rounded-full px-6 py-5 font-bold shadow-lg shadow-destructive/20 transition-all duration-300 hover:scale-[1.03]"
                onClick={handleLeaveRoom}
              >
                <PhoneOff className="mr-2 size-4 fill-current" />
                Leave Date
              </Button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className={`z-20 flex w-full flex-col border-l border-white/5 bg-[#1b1522]/40 backdrop-blur-3xl md:w-[380px] shrink-0 ${mobileTab === 'chat' ? 'flex flex-1' : 'hidden md:flex'}`}>
          {/* Music Card */}
          <div className="border-b border-white/5 p-5 bg-black/10">
            <h4 className="mb-3.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Music className="size-3.5 text-primary" /> Shared Audio
            </h4>
            <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-secondary/20 p-3 shadow-md">
              <div className="relative size-12 overflow-hidden rounded-xl bg-muted border border-white/5 shrink-0">
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
                <h5 className="truncate text-sm font-bold text-white">
                  {currentSong?.title || "Lo-Fi Cafe Vibes"}
                </h5>
                <p className="truncate text-xs text-muted-foreground/80 mt-0.5">
                  {currentSong?.artist || "Chillhop Music"} {audioOffset > 0 && `(Sync: +${Math.floor(audioOffset)}s)`}
                </p>
              </div>
              <Button
                variant="secondary"
                size="icon"
                className="size-10 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 shrink-0 hover:scale-105 transition-transform"
                onClick={async () => {
                  console.log("PLAY_BUTTON_CLICKED")
                  if (isPlaying) {
                    await musicApi.pause(roomId)
                  } else {
                    const songId = selectedSong?.id || (songs.length > 0 ? songs[0].id : "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11")
                    console.log("MUSIC_PLAY_REQUEST", { roomId, songId })
                    try {
                      const response = await musicApi.play(roomId, songId)
                      console.log("MUSIC_PLAY_RESPONSE", response)
                    } catch (err) {
                      console.error("Failed to trigger play:", err)
                    }
                  }
                  setIsPlaying(!isPlaying)
                }}
              >
                {isPlaying ? <Pause className="size-4.5" /> : <Play className="size-4.5 fill-current" />}
              </Button>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/5 p-5 bg-black/10">
              <h4 className="font-heading text-sm font-bold text-white">Live Chat</h4>
              <Button variant="ghost" size="icon" className="size-8 rounded-full hover:bg-white/5">
                <MoreHorizontal className="size-4 text-muted-foreground" />
              </Button>
            </div>

            {/* Messages */}
            <div ref={chatContainerRef} className="flex flex-1 flex-col gap-5 overflow-y-auto p-5">
              {displayMessages.map((msg) => {
                const currentUserId = user?.id
                const isMe = msg.userId === currentUserId
                return (
                  <div key={msg.id} className={`flex gap-3 items-end ${isMe ? "flex-row-reverse" : ""}`}>
                    <Avatar className="size-8 border border-white/10 shadow-sm shrink-0">
                      <AvatarImage src={isMe ? roomDetails?.members?.find((m: any) => m.userId === currentUserId)?.avatar || "/images/avatar-a.png" : otherUser?.avatar || "/images/avatar-b.png"} className="object-cover" />
                      <AvatarFallback>{isMe ? "Y" : otherUser?.name?.charAt(0) || "M"}</AvatarFallback>
                    </Avatar>
                    <div className={`flex max-w-[75%] flex-col ${isMe ? "items-end" : ""} gap-1`}>
                      <span className="text-[10px] font-semibold text-muted-foreground px-1">{isMe ? "You" : otherUser?.name || "Match"}</span>
                      <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${isMe ? "rounded-br-none bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md font-medium" : "rounded-bl-none bg-secondary/35 text-secondary-foreground border border-white/5"}`}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-white/5 bg-black/20 p-5 backdrop-blur-sm">
              <form
                className="relative flex items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (message.trim()) {
                    send("message", { content: message.trim() })
                    setMessage('')
                  }
                }}
              >
                <Input
                  value={message}
                  onChange={(e) => handleTyping(e.target.value)}
                  placeholder="Type a message..."
                  className="h-11 rounded-xl border-white/10 bg-secondary/20 pr-12 focus-visible:ring-primary/40 text-white placeholder:text-muted-foreground/60 focus-visible:bg-secondary/40 focus-visible:border-primary/50 transition-colors"
                />
                <Button
                  type="submit"
                  size="icon"
                  variant="ghost"
                  className="absolute right-1 size-9 rounded-lg text-primary hover:bg-primary/10 hover:text-primary transition-all"
                  disabled={!message.trim()}
                >
                  <Send className="size-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Mobile bottom tab switcher */}
        <div className="flex border-t border-white/5 bg-[#120f1a]/95 backdrop-blur-md p-2 md:hidden">
          <Button
            variant={mobileTab === 'scene' ? 'default' : 'ghost'}
            className={`flex-1 rounded-xl py-3 text-xs font-bold ${mobileTab === 'scene' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
            onClick={() => setMobileTab('scene')}
          >
            Date Scene
          </Button>
          <Button
            variant={mobileTab === 'chat' ? 'default' : 'ghost'}
            className={`flex-1 rounded-xl py-3 text-xs font-bold ${mobileTab === 'chat' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
            onClick={() => setMobileTab('chat')}
          >
            Chat & Music
          </Button>
        </div>
      </div>
    </>
  )
}