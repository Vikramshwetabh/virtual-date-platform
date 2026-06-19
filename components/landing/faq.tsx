import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    q: 'What exactly is a virtual date?',
    a: 'A virtual date is a private, immersive video-and-voice experience set in a beautiful environment like a coffee shop or park. You and your match appear as avatars and talk in real time — all the spark of a first date, none of the logistics.',
  },
  {
    q: 'Do I have to meet in person eventually?',
    a: 'Never before you are ready. Virtual Date exists so you can take your time. Many people go on several virtual dates before deciding whether to meet in real life — and that is completely up to you.',
  },
  {
    q: 'How does Virtual Date keep me safe?',
    a: 'Your personal details stay private until you choose to share them. Every date happens in a moderated space, and you can leave any date instantly. We also verify profiles to reduce fake accounts.',
  },
  {
    q: 'How are my matches chosen?',
    a: 'Our compatibility engine looks at your interests, preferred date environments, and conversation style to surface people you are likely to genuinely click with — not just an endless swipe feed.',
  },
  {
    q: 'Is Virtual Date free?',
    a: 'You can sign up, build your profile, and go on your first virtual date for free. Premium plans unlock unlimited dates, advanced matching, and exclusive environments.',
  },
]

export function Faq() {
  return (
    <section id="faq" className="px-4 py-20 md:py-28">
      <div className="mx-auto max-w-3xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-balance md:text-5xl">
            Questions, answered
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground md:text-lg">
            Everything you need to know about dating the Virtual Date way.
          </p>
        </div>

        <Accordion className="mt-12 space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-b border-white/5 px-2">
              <AccordionTrigger className="py-5 text-base font-semibold text-foreground/90 transition-colors hover:text-primary hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground/90 pb-5">
                <p className="leading-relaxed text-sm md:text-base">{faq.a}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
