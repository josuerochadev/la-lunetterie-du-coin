import { useNativeScroll } from '@/hooks/useNativeScroll';
import Layout from '@/components/common/Layout';
import StickySection from '@/components/common/StickySection';
import { Seo } from '@/seo/Seo';
import AboutHero from '@/sections/about/AboutHero';
import AboutHistory from '@/sections/about/AboutHistory';
import AboutValues from '@/sections/about/AboutValues';
import AboutTeam from '@/sections/about/AboutTeam';
import AboutEngagement from '@/sections/about/AboutEngagement';
import AboutCTA from '@/sections/about/AboutCTA';

/**
 * Page À propos — Scrollytelling immersif (Rebranding 2026)
 *
 * Flow chromatique :
 *   Hero (noir) → Histoire (noir, expansion jaune) → Valeurs (jaune)
 *   → Équipe (noir) → Engagement (blanc) → CTA (jaune) → Footer (navy)
 *
 * Transitions :
 *   Hero→Histoire : continuation noire fluide
 *   Histoire→Valeurs : overlay jaune (comme HomeStory→HomeOffers)
 *   Valeurs→Équipe : courbe convexe noire (comme HomeHero→HomeStory)
 *   Équipe→Engagement : transition directe
 *   Engagement→CTA : reveal jaune (comme HomeContact)
 *   CTA→Footer : courbe convexe du footer
 */
export default function AboutPage() {
  useNativeScroll();

  return (
    <>
      <Seo
        title="À propos - La Lunetterie du Coin"
        description="Découvrez l'histoire de La Lunetterie du Coin, opticien indépendant engagé depuis 2016 dans le recyclage de lunettes à Strasbourg."
        canonicalPath="/a-propos"
      />
      <Layout>
        {/* Hero — fond noir, word reveal "DEPUIS 2016" */}
        <StickySection zIndex={11} enableSticky>
          <AboutHero />
        </StickySection>

        {/* Histoire — fond noir, photo reveal + expansion jaune */}
        <StickySection zIndex={12}>
          <AboutHistory />
        </StickySection>

        {/* Valeurs — fond jaune, cards cascade 3D */}
        <StickySection zIndex={13}>
          <AboutValues />
        </StickySection>

        {/* Équipe — fond noir, portrait parallax + bio word reveal */}
        <StickySection zIndex={14}>
          <AboutTeam />
        </StickySection>

        {/* Engagement — fond blanc, counter géant + stats */}
        <StickySection zIndex={15}>
          <AboutEngagement />
        </StickySection>

        {/* CTA — plein écran sticky, hold 200vh pour retarder le footer */}
        <StickySection zIndex={16} enableSticky wrapperMinHeight="200vh">
          <AboutCTA />
        </StickySection>
      </Layout>
    </>
  );
}
