'use client';

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'

const links = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Environments', href: '#environments' },
  { label: 'Stories', href: '#stories' },
  { label: 'FAQ', href: '#faq' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 animate-fade-in-up">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-border bg-background/95 px-5 py-3 shadow-lg shadow-black/5 dark:shadow-black/20">
        <Link href="/" aria-label="Virtual Date home" className="transition-transform duration-300 hover:scale-105">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Button variant="ghost" size="lg" className="transition-all hover:bg-foreground/5 hover:text-foreground" render={<Link href="/login" />}>
            Log in
          </Button>
          <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold hover:opacity-95 shadow-md shadow-primary/20 transition-all duration-200" render={<Link href="/signup" />}>
            Start Dating
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl hover:bg-foreground/5"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      <div
        className={cn(
          'mx-auto mt-2 max-w-6xl overflow-hidden rounded-2xl border border-border bg-background/95 transition-all md:hidden',
          open ? 'max-h-96 opacity-100' : 'max-h-0 border-transparent opacity-0',
        )}
      >
        <nav className="flex flex-col gap-1 p-3">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-2 flex flex-col gap-2">
            <Button variant="outline" className="w-full" render={<Link href="/login" />}>
              Log in
            </Button>
            <Button className="w-full bg-gradient-to-r from-primary to-accent" render={<Link href="/signup" />}>Start Dating</Button>
          </div>
        </nav>
      </div>
    </header>
  )
}
