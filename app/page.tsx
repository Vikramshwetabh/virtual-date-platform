import { SiteHeader } from '@/components/landing/site-header'
import { Hero } from '@/components/landing/hero'
import { Features } from '@/components/landing/features'
import { EnvironmentsShowcase } from '@/components/landing/environments-showcase'
import { Testimonials } from '@/components/landing/testimonials'
import { Faq } from '@/components/landing/faq'
import { CtaFooter } from '@/components/landing/cta-footer'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <Hero />
        <Features />
        <EnvironmentsShowcase />
        <Testimonials />
        <Faq />
        <CtaFooter />
      </main>
    </div>
  )
}
