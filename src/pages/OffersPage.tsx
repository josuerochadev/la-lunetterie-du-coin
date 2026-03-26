import Layout from '@/components/common/Layout';
import StickySection from '@/components/common/StickySection';
import OffersHero from '@/sections/offers/OffersHero';
import OffersContent from '@/sections/offers/OffersContent';
import OffersCTA from '@/sections/offers/OffersCTA';
import { useNativeScroll } from '@/hooks/useNativeScroll';
import { Seo } from '@/seo/Seo';

export default function OffersPage() {
  useNativeScroll();

  return (
    <>
      <Seo
        title="Nos Offres - La Lunetterie du Coin"
        description="Découvrez nos offres exclusives : jusqu'à 70€ de réduction avec le recyclage, deuxième paire à partir de 59€. Économisez en faisant un geste pour la planète."
        canonicalPath="/offres"
      />
      <Layout>
        {/* Hero — fond noir, titre accent */}
        <StickySection zIndex={11} enableSticky>
          <OffersHero />
        </StickySection>

        {/* Offres — carrousel sticky 3D */}
        <StickySection zIndex={12}>
          <OffersContent />
        </StickySection>

        {/* CTA — fond jaune, mot zoom */}
        <StickySection zIndex={13} enableSticky wrapperMinHeight="200vh">
          <OffersCTA />
        </StickySection>
      </Layout>
    </>
  );
}
