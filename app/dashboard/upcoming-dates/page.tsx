import { Calendar } from 'lucide-react'

export default function UpcomingDatesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="font-heading text-3xl font-bold flex items-center gap-3">
          <Calendar className="size-8 text-primary" />
          Upcoming Dates
        </h1>
        <p className="text-muted-foreground text-lg">
          Your scheduled virtual dates will appear here.
        </p>
      </div>
    </div>
  )
}
