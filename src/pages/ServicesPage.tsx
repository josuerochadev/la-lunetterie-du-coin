import Layout from '@/components/common/Layout';
import StickySection from '@/components/common/StickySection';
import ServicesHero from '@/sections/services/ServicesHero';
import ServicesContent from '@/sections/services/ServicesContent';
import ServicesCTA from '@/sections/services/ServicesCTA';
import { useNativeScroll } from '@/hooks/useNativeScroll';
import { Seo } from '@/seo/Seo';

export default function ServicesPage() {
  useNativeScroll();

  return (
    <>
      <Seo
        title="Nos Services - La Lunetterie du Coin"
        description="Découvrez tous nos services : lunettes neuves et d'occasion, examens de vue, lentilles de contact, réparations. Expertise et recyclage à Strasbourg."
        canonicalPath="/services"
      />
      <Layout>
        {/* Hero — fond jaune, titre géant */}
        <StickySection zIndex={11} enableSticky>
          <ServicesHero />
        </StickySection>

        {/* Services — défilé éditorial immersif */}
        <StickySection zIndex={12}>
          <ServicesContent />
        </StickySection>

        {/* CTA final — fond jaune, sticky */}
        <StickySection zIndex={13} enableSticky wrapperMinHeight="200vh">
          <ServicesCTA />
        </StickySection>
      </Layout>
    </>
  );
}
