import Layout from '@/components/common/Layout';
import StickySection from '@/components/common/StickySection';
import Hero from '@/sections/Hero';
import OurStory from '@/sections/OurStory';
import ServicesMinimal from '@/sections/ServicesMinimal';
import EngagementEcologique from '@/sections/EngagementEcologique';
import OffersEditorial from '@/sections/OffersEditorial';
import Testimonials from '@/sections/Testimonials';
import ContactEnhanced from '@/sections/ContactEnhanced';
import CursorFollower from '@/components/common/CursorFollower';
import { useNativeScroll } from '@/hooks/useNativeScroll';
import { Seo } from '@/seo/Seo';
import { LocalBusinessJsonLd } from '@/seo/LocalBusinessJsonLd';

export default function HomePage() {
  useNativeScroll();
  return (
    <>
      <Seo
        title="La Lunetterie du Coin - Opticien indépendant à Strasbourg"
        description="Opticien indépendant depuis 2016. Lunettes neuves et d'occasion, lentilles de contact, examens de vue. Engagement écologique et recyclage."
        canonicalPath="/"
      />
      <LocalBusinessJsonLd />
      <CursorFollower />
      <div className="relative z-base">
        <Layout>
          {/* Hero avec effet parallax - reste sticky pendant que les autres scrollent par-dessus */}
          <StickySection zIndex={11} enableSticky={true}>
            <Hero />
          </StickySection>
          {/* Toutes les autres sections scrollent normalement avec z-index croissant */}
          <StickySection zIndex={12}>
            <OurStory />
          </StickySection>
          <StickySection zIndex={13}>
            <ServicesMinimal />
          </StickySection>
          <StickySection zIndex={14}>
            <OffersEditorial />
          </StickySection>
          <StickySection zIndex={15}>
            <EngagementEcologique />
          </StickySection>
          <StickySection zIndex={16}>
            <Testimonials />
          </StickySection>
          <StickySection zIndex={17}>
            <ContactEnhanced />
          </StickySection>
        </Layout>
      </div>
    </>
  );
}
