import { Coffee, BookOpen, ShieldCheck, HeartHandshake } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const features = [
  {
    icon: Coffee,
    title: 'Virtual Coffee Dates',
    description:
      'Share a cozy café table, sip a virtual latte, and let the conversation flow naturally — no awkward first-meeting nerves.',
  },
  {
    icon: BookOpen,
    title: 'Library Dates',
    description:
      'Wander quiet shelves together for the deep talkers. The perfect setting for slow, meaningful connection.',
  },
  {
    icon: ShieldCheck,
    title: 'Safe First Meetings',
    description:
      'Get to know someone in a moderated, private space before you ever share personal details or meet in person.',
  },
  {
    icon: HeartHandshake,
    title: 'Real Connections',
    description:
      'Our compatibility engine surfaces people you actually click with, so every date feels worth showing up for.',
  },
]

export function Features() {
  return (
    <section id="how-it-works" className="px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            A new way to fall for someone
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Virtual dates give you the spark of meeting someone new with none of
            the pressure. Here&apos;s what makes it special.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group h-full border-border bg-card/60 transition-colors hover:border-primary/40"
            >
              <CardContent className="flex flex-col gap-4 p-6">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary transition-transform group-hover:scale-110">
                  <feature.icon className="size-5" />
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="font-heading text-lg font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
