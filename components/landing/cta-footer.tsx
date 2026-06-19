import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'

const footerLinks = {
  Product: ['How it works', 'Environments', 'Pricing', 'Safety'],
  Company: ['About', 'Careers', 'Press', 'Blog'],
  Support: ['Help Center', 'Contact', 'Community', 'Status'],
  Legal: ['Privacy', 'Terms', 'Cookies', 'Guidelines'],
}

export function CtaFooter() {
  return (
    <footer className="px-4 pb-10">
      <section className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-card/40 to-background/60 px-6 py-16 text-center md:px-12 md:py-24 shadow-2xl">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 size-[35rem] -translate-x-1/2 rounded-full bg-primary/25 blur-[120px] animate-pulse-slow"
        />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-balance md:text-5xl leading-tight">
            Your next great date is <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-glow-primary">one click away</span>
          </h2>
          <p className="mt-5 text-pretty text-muted-foreground md:text-lg">
            Join thousands meeting before they meet. Build your profile and go
            on your first virtual date today.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="h-12 px-6 bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold hover:opacity-95 shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.03]" render={<Link href="/signup" />}>
              Start Dating
              <ArrowRight data-icon="inline-end" className="transition-transform group-hover/button:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-6 border-white/10 hover:border-primary/40 hover:bg-white/5 transition-all duration-300 hover:scale-[1.03]" render={<Link href="/dashboard" />}>
              Try Demo
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto mt-16 max-w-6xl">
        <div className="grid grid-cols-2 gap-8 border-b border-white/5 pb-12 md:grid-cols-6">
          <div className="col-span-2 flex flex-col gap-4">
            <Logo />
            <p className="max-w-xs text-sm text-muted-foreground/80 leading-relaxed">
              Meet before you meet. A safer, more meaningful way to date.
            </p>
          </div>
          {Object.entries(footerLinks).map(([group, items]) => (
            <div key={group} className="flex flex-col gap-4">
              <h4 className="text-sm font-semibold tracking-wider uppercase text-white/95">{group}</h4>
              <ul className="flex flex-col gap-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-all duration-200 hover:text-primary"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-between gap-4 py-8 text-sm text-muted-foreground/80 sm:flex-row">
          <p>© {new Date().getFullYear()} Virtual Date. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Made with <span className="text-primary animate-pulse">❤️</span> for real connection.
          </p>
        </div>
      </div>
    </footer>
  )
}
