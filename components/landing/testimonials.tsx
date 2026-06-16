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
    <section id="stories" className="px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            Real people, real first sparks
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Thousands have found a more comfortable, more genuine way to date.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="h-full border-border bg-card/60">
              <CardContent className="flex h-full flex-col gap-5 p-6">
                <div className="flex gap-0.5 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
                <p className="flex-1 text-pretty leading-relaxed">
                  {`“${t.quote}”`}
                </p>
                <div className="flex items-center gap-3">
                  <Image
                    src={t.image || '/placeholder.svg'}
                    alt={t.name}
                    width={40}
                    height={40}
                    className="size-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
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
