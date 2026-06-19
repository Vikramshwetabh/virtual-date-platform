import Image from 'next/image'
import { Clock } from 'lucide-react'
import { environments } from '@/lib/data'
import { Badge } from '@/components/ui/badge'

export function EnvironmentsShowcase() {
  return (
    <section id="environments" className="px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
            Five immersive worlds
          </Badge>
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-balance md:text-5xl">
            Pick the perfect place for your date
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground md:text-lg">
            Each environment is designed to bring out a different side of your
            connection — from cozy and casual to romantic and dreamy.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {environments.map((env, i) => (
            <article
              key={env.id}
              className={`group relative overflow-hidden rounded-3xl border border-white/5 bg-card/30 shadow-xl transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 ${
                i === 0 ? 'lg:col-span-2 lg:row-span-1' : ''
              }`}
            >
              <div className="overflow-hidden">
                <Image
                  src={env.image || '/placeholder.svg'}
                  alt={env.name}
                  width={800}
                  height={500}
                  className="h-60 w-full object-cover transition-transform duration-700 group-hover:scale-105 md:h-72"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#120f1a] via-black/30 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-6 z-10">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent">{env.mood}</span>
                  <h3 className="font-heading text-2xl font-bold tracking-tight text-white mt-1">
                    {env.name}
                  </h3>
                </div>
                <Badge
                  variant="secondary"
                  className="glass-premium shrink-0 gap-1.5 border border-accent/20 bg-accent/15 text-accent font-semibold px-3 py-1.5"
                >
                  <Clock className="size-3.5" />
                  {env.duration}
                </Badge>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
