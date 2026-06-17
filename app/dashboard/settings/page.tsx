import { Settings } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="font-heading text-3xl font-bold flex items-center gap-3">
          <Settings className="size-8 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground text-lg">
          Manage your account and preferences.
        </p>
      </div>
    </div>
  )
}
