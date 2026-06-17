import { MessageCircleHeart } from 'lucide-react'

export default function MessagesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="font-heading text-3xl font-bold flex items-center gap-3">
          <MessageCircleHeart className="size-8 text-primary" />
          Messages
        </h1>
        <p className="text-muted-foreground text-lg">
          Your conversations will appear here.
        </p>
      </div>
    </div>
  )
}
