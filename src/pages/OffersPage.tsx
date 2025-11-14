import Layout from '@/components/common/Layout';
import OffersHero from '@/sections/offers/OffersHero';
import OffersContent from '@/sections/offers/OffersContent';
import OffersCTA from '@/sections/offers/OffersCTA';
import { useNativeScroll } from '@/hooks/useNativeScroll';
import { Seo } from '@/seo/Seo';

/**
 * Page Offres détaillée
 *
 * Page complète présentant nos deux offres principales :
 * - Programme de recyclage (jusqu'à 70€ de réduction)
 * - Deuxième paire (à partir de 59€)
 *
 * Style minimaliste cohérent avec ServicesPage
 *
 * @component
 * @returns {JSX.Element} Page Offres complète
 */
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
        <OffersHero />
        <OffersContent />
        <OffersCTA />
      </Layout>
    </>
  );
}
