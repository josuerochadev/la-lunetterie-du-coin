import Layout from '@/components/common/Layout';
import StickySection from '@/components/common/StickySection';
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

          {/*
            Sections wrapper — single z-index layer above Hero (z-10/z-11).
            No per-section z-index or isolation to avoid GPU compositing seams.
            StickySection renders an anti-seam strip that extends bg 2px below each boundary.
          */}
          <div className="relative" style={{ zIndex: 12 }}>
            <StickySection className="bg-black">
              <HomeStory />
            </StickySection>

            <StickySection className="bg-accent">
              <HomeOffers />
            </StickySection>

            <StickySection className="bg-accent">
              <HomeServices />
            </StickySection>

            <StickySection className="bg-black">
              <HomeTestimonials />
            </StickySection>

            <StickySection className="bg-accent" enableSticky wrapperMinHeight="200vh">
              <HomeContact />
            </StickySection>
          </div>
        </Layout>
      </div>
    </>
  );
}
