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
 * Page À propos - Architecture modulaire avec sections séparées
 *
 * Pattern cohérent avec HomePage : chaque section est un composant
 * indépendant et réutilisable dans `src/sections/about/`.
 *
 * Sections :
 * - AboutHero - Titre et tagline de la page
 * - AboutHistory - Notre histoire avec image pleine largeur
 * - AboutValues - Grid de 3 valeurs avec icônes
 * - AboutTeam - Présentation de Romain Corato
 * - AboutEngagement - Stats et engagement écologique
 * - AboutCTA - Call-to-action final
 *
 * @component
 * @returns {JSX.Element} Page À propos modulaire
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
        {/* Hero avec effet parallax - reste sticky pendant que les autres scrollent par-dessus */}
        <StickySection zIndex={11} enableSticky={true}>
          <AboutHero />
        </StickySection>

        {/* Toutes les autres sections scrollent normalement avec z-index croissant */}
        <StickySection zIndex={12}>
          <AboutHistory />
        </StickySection>

        <StickySection zIndex={13}>
          <AboutValues />
        </StickySection>

        <StickySection zIndex={14}>
          <AboutTeam />
        </StickySection>

        <StickySection zIndex={15}>
          <AboutEngagement />
        </StickySection>

        <StickySection zIndex={16}>
          <AboutCTA />
        </StickySection>
      </Layout>
    </>
  );
}
