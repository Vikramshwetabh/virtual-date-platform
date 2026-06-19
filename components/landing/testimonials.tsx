import Image from 'next/image'
import { Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const testimonials = [
  {
    quote:
      "We had three virtual coffee dates before meeting. By the time we sat down in person, it felt like we'd known each other for months.",
    name: 'Maya & James',
    detail: 'Matched in March',
    image: '/images/person-1.png',
  },
  {
    quote:
      "The library date was perfect for me — I'm shy, and getting to talk without the pressure of a real venue changed everything.",
    name: 'Priya',
    detail: 'Austin, TX',
    image: '/images/person-3.png',
  },
  {
    quote:
      'I felt safe. I got to know who he really was before sharing anything personal. That peace of mind is everything.',
    name: 'Sofia',
    detail: 'Chicago, IL',
    image: '/images/person-5.png',
  },
]

export function Testimonials() {
  return (
    <section id="stories" className="relative px-4 py-20 md:py-28 bg-card/5 border-y border-border">
      <div className="absolute inset-0 -z-10 bg-radial-gradient(at 50% 50%, var(--primary) / 4%, transparent 60%)" />
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-balance md:text-5xl">
            Real people, real first sparks
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground md:text-lg">
            Thousands have found a more comfortable, more genuine way to date.
          </p>
        </div>
 
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="h-full border border-border bg-card shadow-sm transition-all duration-200 hover:border-primary/30">
              <CardContent className="flex h-full flex-col gap-5 p-7">
                <div className="flex gap-1 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
                <p className="flex-1 text-pretty leading-relaxed text-foreground/90 italic">
                  {`“${t.quote}”`}
                </p>
                <div className="flex items-center gap-3.5 border-t border-border pt-4 mt-2">
                  <div className="relative size-11 overflow-hidden rounded-full border-2 border-primary/20">
                    <Image
                      src={t.image || '/placeholder.svg'}
                      alt={t.name}
                      width={44}
                      height={44}
                      className="size-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.detail}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
