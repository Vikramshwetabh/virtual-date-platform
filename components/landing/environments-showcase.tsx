import Image from 'next/image'
import { Clock } from 'lucide-react'
import { environments } from '@/lib/data'
import { Badge } from '@/components/ui/badge'

export function EnvironmentsShowcase() {
  return (
    <section id="environments" className="px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">
            Five immersive worlds
          </Badge>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            Pick the perfect place for your date
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Each environment is designed to bring out a different side of your
            connection — from cozy and casual to romantic and dreamy.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {environments.map((env, i) => (
            <article
              key={env.id}
              className={`group relative overflow-hidden rounded-2xl border border-border ${
                i === 0 ? 'lg:col-span-2 lg:row-span-1' : ''
              }`}
            >
              <Image
                src={env.image || '/placeholder.svg'}
                alt={env.name}
                width={800}
                height={500}
                className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105 md:h-64"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                <div>
                  <h3 className="font-heading text-xl font-semibold">
                    {env.name}
                  </h3>
                  <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                    {env.mood}
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="glass shrink-0 gap-1 border border-border"
                >
                  <Clock className="size-3" />
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
