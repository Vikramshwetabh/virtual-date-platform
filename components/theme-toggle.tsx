'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="size-8 rounded-lg border border-border/20 shrink-0" />
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-xl border border-border bg-card/5 hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200 shrink-0"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="size-[1.1rem] text-accent fill-accent/10 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="size-[1.1rem] text-primary fill-primary/10 transition-transform duration-300 hover:-rotate-12" />
      )}
    </Button>
  )
}
