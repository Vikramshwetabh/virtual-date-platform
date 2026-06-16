import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Play, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pt-32 pb-16 md:pt-44 md:pb-24">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 size-[40rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-40 right-0 size-[28rem] rounded-full bg-accent/10 blur-[120px]"
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            Dating reimagined for real connection
          </span>

          <h1 className="mt-6 font-heading text-5xl font-semibold tracking-tight text-balance md:text-7xl">
            Meet Before You Meet.
          </h1>

          <p className="mt-6 max-w-xl text-lg text-pretty text-muted-foreground md:text-xl">
            Experience virtual coffee dates, library dates, and park walks
            before meeting in real life.
          </p>

          <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" className="w-full sm:w-auto" render={<Link href="/signup" />}>
              Start Dating
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
              render={<Link href="/dashboard" />}
            >
              <Play data-icon="inline-start" />
              Try Demo
            </Button>
          </div>
        </div>

        <div className="relative mx-auto mt-14 max-w-4xl">
          <div className="overflow-hidden rounded-3xl border border-border shadow-2xl shadow-black/40">
            <Image
              src="/images/hero-coffee-date.png"
              alt="Two avatars sharing a virtual coffee date in a cozy café"
              width={1280}
              height={720}
              priority
              className="h-auto w-full"
            />
          </div>
          <div className="glass absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-border px-5 py-3 whitespace-nowrap">
            <span className="flex -space-x-2">
              {['/images/person-1.png', '/images/person-4.png', '/images/person-3.png'].map(
                (src) => (
                  <Image
                    key={src}
                    src={src || "/placeholder.svg"}
                    alt=""
                    width={28}
                    height={28}
                    className="size-7 rounded-full border-2 border-card object-cover"
                  />
                ),
              )}
            </span>
            <span className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">12,000+</span> dates
              this week
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
