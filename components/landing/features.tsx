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
    <section id="how-it-works" className="relative px-4 py-20 md:py-28">
      {/* background decoration */}
      <div className="absolute top-1/2 left-1/4 -z-10 size-[30rem] -translate-y-1/2 rounded-full bg-accent/5 blur-[120px]" />

      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-balance md:text-5xl">
            A new way to fall for someone
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground md:text-lg">
            Virtual dates give you the spark of meeting someone new with none of
            the pressure. Here&apos;s what makes it special.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group h-full border border-border bg-card shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md"
            >
              <CardContent className="flex flex-col gap-5 p-7">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary transition-all duration-200">
                  <feature.icon className="size-5.5" />
                </span>
                <div className="flex flex-col gap-2.5">
                  <h3 className="font-heading text-xl font-bold tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground/90">
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
