import { useState } from 'react';

import Layout from '@/components/common/Layout';
import StickySection from '@/components/common/StickySection';
import SectionTransition from '@/components/motion/SectionTransition';
import HomeSplash from '@/sections/home/HomeSplash';
import HomeHero from '@/sections/home/HomeHero';
import HomeStory from '@/sections/home/HomeStory';
import HomeServices from '@/sections/home/HomeServices';
import HomeEngagement from '@/sections/home/HomeEngagement';
import HomeOffers from '@/sections/home/HomeOffers';
import HomeTestimonials from '@/sections/home/HomeTestimonials';
import HomeContact from '@/sections/home/HomeContact';
import CursorFollower from '@/components/common/CursorFollower';
import { useNativeScroll } from '@/hooks/useNativeScroll';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { Seo } from '@/seo/Seo';
import { LocalBusinessJsonLd } from '@/seo/LocalBusinessJsonLd';

export default function HomePage() {
  useNativeScroll();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Navbar is hidden during splash, revealed by hero choreography
  const [navbarRevealed, setNavbarRevealed] = useState(prefersReducedMotion);

  return (
    <>
      <Seo
        title="La Lunetterie du Coin - Opticien indépendant à Strasbourg"
        description="Opticien indépendant depuis 2016. Lunettes neuves et d'occasion, lentilles de contact, examens de vue. Engagement écologique et recyclage."
        canonicalPath="/"
      />
      <LocalBusinessJsonLd />
      <CursorFollower />

      {/* Splash intro — fixed overlay above everything */}
      {!prefersReducedMotion && <HomeSplash />}

      <div className="relative z-base">
        <Layout navbarRevealed={navbarRevealed}>
          {/* Spacer for splash scroll transition (50vh of scroll before hero sticks) */}
          {!prefersReducedMotion && <div className="h-screen" aria-hidden="true" />}

          {/* Hero — sticky parallax */}
          <StickySection zIndex={11} enableSticky={true} wrapperMinHeight="250vh">
            <HomeHero onRevealNavbar={() => setNavbarRevealed(true)} />
          </StickySection>

          {/* Hero → Story : gradient integrated into Story section */}
          <StickySection zIndex={12}>
            <HomeStory />
          </StickySection>

          {/* Story → Services (both black, no transition needed) */}
          <StickySection zIndex={13}>
            <HomeServices />
          </StickySection>

          {/* Services → Offers */}
          <StickySection zIndex={14}>
            <SectionTransition variant="fade" fromColor="black" toColor="white" />
            <HomeOffers />
          </StickySection>

          {/* Offers → Engagement */}
          <StickySection zIndex={15}>
            <SectionTransition variant="pattern" />
            <HomeEngagement />
          </StickySection>

          {/* Engagement → Testimonials */}
          <StickySection zIndex={16}>
            <SectionTransition variant="fade" fromColor="black" toColor="white" />
            <HomeTestimonials />
          </StickySection>

          {/* Testimonials → Contact */}
          <StickySection zIndex={17}>
            <SectionTransition variant="diagonal" fromColor="white" toColor="#FDD835" />
            <HomeContact />
          </StickySection>
        </Layout>
      </div>
    </>
  );
}
