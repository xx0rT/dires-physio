import { BenefitsSection } from '@/components/layout/sections/benefits'
import { CommunitySection } from '@/components/layout/sections/community'
import { ContactSection } from '@/components/layout/sections/contact'
import { FAQSection } from '@/components/layout/sections/faq'
import { FeaturesSection } from '@/components/layout/sections/features'
import { HeroSection } from '@/components/layout/sections/hero'
import { PricingSection } from '@/components/layout/sections/pricing'
import { ServicesSection } from '@/components/layout/sections/services'
import { TeamSection } from '@/components/layout/sections/team'
import { TestimonialSection } from '@/components/layout/sections/testimonial'
import LogoCloud from '@/components/logo-cloud'
import { WaveDivider } from '@/components/ui/wave-divider'

export default function HomePage() {
  return (
    <>
      <div className="relative">
        <HeroSection />
        <WaveDivider variant={1} position="bottom" />
      </div>

      <div className="relative">
        <LogoCloud />
        <WaveDivider variant={2} position="top" flip />
      </div>

      <div className="relative">
        <BenefitsSection />
        <WaveDivider variant={1} position="bottom" />
      </div>

      <div className="relative">
        <FeaturesSection />
        <WaveDivider variant={2} position="bottom" flip />
      </div>

      <div className="relative">
        <ServicesSection />
        <WaveDivider variant={1} position="bottom" />
      </div>

      <div className="relative">
        <TestimonialSection />
        <WaveDivider variant={2} position="bottom" flip />
      </div>

      <div className="relative">
        <TeamSection />
        <WaveDivider variant={1} position="bottom" />
      </div>

      <div className="relative">
        <CommunitySection />
        <WaveDivider variant={2} position="bottom" flip />
      </div>

      <div className="relative">
        <PricingSection />
        <WaveDivider variant={1} position="bottom" />
      </div>

      <div className="relative">
        <ContactSection />
      </div>

      <div className="relative">
        <FAQSection />
      </div>
    </>
  )
}
