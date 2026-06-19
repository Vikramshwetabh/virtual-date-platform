import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pt-32 pb-16 md:pt-44 md:pb-24">
      {/* ambient glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 size-[45rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-40 right-0 size-[32rem] rounded-full bg-accent/5 blur-[130px]"
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center animate-fade-in-up">
          <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur-md">
            Dating reimagined for real connection
          </span>

          <h1 className="mt-6 font-heading text-5xl font-extrabold tracking-tight text-balance md:text-7xl leading-tight">
            Meet Before <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent text-glow-primary">You Meet.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-pretty text-muted-foreground md:text-xl">
            Experience virtual coffee dates, library dates, and park walks
            before meeting in real life. A safer, more meaningful way to date.
          </p>

          <div className="mt-8 flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="w-full sm:w-auto h-12 px-6 bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold hover:opacity-95 shadow-lg shadow-primary/25 transition-all duration-200" render={<Link href="/signup" />}>
              Start Dating
              <ArrowRight data-icon="inline-end" className="transition-transform group-hover/button:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto h-12 px-6 border-border hover:bg-foreground/5 transition-all duration-200"
              render={<Link href="/dashboard" />}
            >
              <Play data-icon="inline-start" className="fill-current" />
              Try Demo
            </Button>
          </div>
        </div>

        <div className="relative mx-auto mt-16 max-w-4xl">
          {/* Decorative floating widgets on top of the hero image */}
          <div className="absolute -top-6 -left-6 z-10 hidden sm:flex items-center gap-3 rounded-2xl border border-border bg-background p-3 shadow-xl">
            <span className="flex size-2 animate-ping rounded-full bg-green-500" />
            <span className="text-xs font-semibold text-foreground">412 Dates Active Now</span>
          </div>

          <div className="overflow-hidden rounded-3xl border border-border shadow-2xl shadow-black/20 dark:shadow-black/55 transition-all duration-300">
            <Image
              src="/images/hero-coffee-date.png"
              alt="Two avatars sharing a virtual coffee date in a cozy café"
              width={1280}
              height={720}
              priority
              className="h-auto w-full transition-transform duration-700 hover:scale-[1.01]"
            />
          </div>
          <div className="glass-premium absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-2xl px-5 py-3.5 whitespace-nowrap shadow-xl shadow-black/30">
            <span className="flex -space-x-2.5">
              {['/images/person-1.png', '/images/person-4.png', '/images/person-3.png'].map(
                (src) => (
                  <Image
                    key={src}
                    src={src || "/placeholder.svg"}
                    alt=""
                    width={32}
                    height={32}
                    className="size-8 rounded-full border-2 border-[#151324] object-cover"
                  />
                ),
              )}
            </span>
            <span className="text-sm text-muted-foreground">
              <span className="font-bold text-foreground">12,000+</span> virtual dates this week
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

