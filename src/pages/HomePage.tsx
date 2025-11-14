import Layout from '@/components/common/Layout';
import StickySection from '@/components/common/StickySection';
import HomeHero from '@/sections/home/HomeHero';
import HomeStory from '@/sections/home/HomeStory';
import HomeServices from '@/sections/home/HomeServices';
import HomeEngagement from '@/sections/home/HomeEngagement';
import HomeOffers from '@/sections/home/HomeOffers';
import HomeTestimonials from '@/sections/home/HomeTestimonials';
import HomeContact from '@/sections/home/HomeContact';
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
            <HomeHero />
          </StickySection>
          {/* Toutes les autres sections scrollent normalement avec z-index croissant */}
          <StickySection zIndex={12}>
            <HomeStory />
          </StickySection>
          <StickySection zIndex={13}>
            <HomeServices />
          </StickySection>
          <StickySection zIndex={14}>
            <HomeOffers />
          </StickySection>
          <StickySection zIndex={15}>
            <HomeEngagement />
          </StickySection>
          <StickySection zIndex={16}>
            <HomeTestimonials />
          </StickySection>
          <StickySection zIndex={17}>
            <HomeContact />
          </StickySection>
        </Layout>
      </div>
    </>
  );
}
