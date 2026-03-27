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
        description="Jusqu'à 70€ de remise en ramenant vos anciennes paires. Deuxième paire dès 59€. Bien vu pour vos yeux, bien vu pour votre portefeuille."
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

        {/* CTA — plein écran sticky, hold 200vh pour retarder le footer */}
        <StickySection zIndex={13} enableSticky wrapperMinHeight="200vh">
          <OffersCTA />
        </StickySection>
      </Layout>
    </>
  );
}
