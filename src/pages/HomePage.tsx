import Layout from '@/components/common/Layout';
import StickySection from '@/components/common/StickySection';
import { Z_INDEX } from '@/config/design';
import HomeSplash from '@/sections/home/HomeSplash';
import HomeHero from '@/sections/home/HomeHero';
import HomeStory from '@/sections/home/HomeStory';
import HomeServices from '@/sections/home/HomeServices';
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

  return (
    <>
      <Seo
        title="La Lunetterie du Coin - Opticien indépendant à Strasbourg"
        description="Opticien indépendant à Strasbourg depuis 2016. Lunettes neuves et d'occasion, examens de vue, lentilles. Du style, du conseil, zéro gâchis."
        canonicalPath="/"
      />
      <LocalBusinessJsonLd />
      <CursorFollower />

      {/* Splash intro — fixed overlay above everything */}
      {!prefersReducedMotion && <HomeSplash />}

      <div className="relative z-base">
        <Layout>
          {/* Spacer — scroll distance for splash fade + hero clip reveal + hero parallax */}
          {!prefersReducedMotion && (
            <div className="pointer-events-none h-[200vh] lg:h-[380vh]" aria-hidden="true" />
          )}

          {/* Hero — fixed overlay on desktop (clipPath L→R), in-flow on mobile */}
          <HomeHero />

          {/* Hero → Story : gradient integrated into Story section */}
          <StickySection zIndex={Z_INDEX.story}>
            <HomeStory />
          </StickySection>

          {/* Story → Offers */}
          <StickySection zIndex={Z_INDEX.offers}>
            <HomeOffers />
          </StickySection>

          {/* Offers → Services */}
          <StickySection zIndex={Z_INDEX.services}>
            <HomeServices />
          </StickySection>

          {/* Services → Testimonials */}
          <StickySection zIndex={Z_INDEX.testimonials}>
            <HomeTestimonials />
          </StickySection>

          {/* Testimonials → Contact */}
          <StickySection zIndex={Z_INDEX.contact}>
            <HomeContact />
          </StickySection>
        </Layout>
      </div>
    </>
  );
}
