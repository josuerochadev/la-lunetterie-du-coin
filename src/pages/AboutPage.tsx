import { useNativeScroll } from '@/hooks/useNativeScroll';
import { useIsLg } from '@/hooks/useIsLg';
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
  const isLg = useIsLg();

  return (
    <>
      <Seo
        title="À propos - La Lunetterie du Coin"
        description="L'expert des ex paires. Depuis 2016, on donne une seconde vie aux montures au cœur de Strasbourg."
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

        {/* Équipe — fond noir, rideau intégral sur Valeurs (-mt-[100vh]) en mobile
            puis sticky pour se faire couvrir par Engagement */}
        <StickySection
          zIndex={14}
          enableSticky={!isLg}
          className={isLg ? undefined : '-mt-[100vh]'}
        >
          <AboutTeam />
        </StickySection>

        {/* Engagement — fond blanc, counter géant + stats */}
        <StickySection zIndex={15} enableSticky={!isLg}>
          <AboutEngagement />
        </StickySection>

        {/* CTA — gère son propre sticky + 200vh en interne */}
        <StickySection zIndex={16}>
          <AboutCTA />
        </StickySection>
      </Layout>
    </>
  );
}
