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
      <section className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-border bg-card/60 px-6 py-16 text-center md:px-12 md:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 size-[30rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]"
        />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance md:text-5xl">
            Your next great date is one click away
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground md:text-lg">
            Join thousands meeting before they meet. Build your profile and go
            on your first virtual date today.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" render={<Link href="/signup" />}>
              Start Dating
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button size="lg" variant="outline" render={<Link href="/dashboard" />}>
              Try Demo
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto mt-12 max-w-6xl">
        <div className="grid grid-cols-2 gap-8 border-b border-border pb-10 md:grid-cols-6">
          <div className="col-span-2 flex flex-col gap-3">
            <Logo />
            <p className="max-w-xs text-sm text-muted-foreground">
              Meet before you meet. A safer, more meaningful way to date.
            </p>
          </div>
          {Object.entries(footerLinks).map(([group, items]) => (
            <div key={group} className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold">{group}</h4>
              <ul className="flex flex-col gap-2">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-between gap-3 py-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Virtual Date. All rights reserved.</p>
          <p>Made with care for real connection.</p>
        </div>
      </div>
    </footer>
  )
}
