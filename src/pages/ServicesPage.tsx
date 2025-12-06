import Layout from '@/components/common/Layout';
import ServicesHero from '@/sections/services/ServicesHero';
import ServicesContent from '@/sections/services/ServicesContent';
import ServicesCTA from '@/sections/services/ServicesCTA';
import { useNativeScroll } from '@/hooks/useNativeScroll';
import { Seo } from '@/seo/Seo';

/**
 * Page Services détaillée
 *
 * Page complète présentant tous les services :
 * - Lunettes neuves
 * - Lunettes d'occasion / Recyclage
 * - Examens de vue
 * - Lentilles de contact
 * - Réparations et ajustements
 *
 * Style minimaliste cohérent avec les autres pages
 *
 * @component
 * @returns {JSX.Element} Page Services complète
 */
export default function ServicesPage() {
  useNativeScroll();

  return (
    <>
      <Seo
        title="Nos Services - La Lunetterie du Coin"
        description="Découvrez tous nos services : lunettes neuves et d'occasion, examens de vue, lentilles de contact, réparations. Expertise et recyclage à Strasbourg."
        canonicalPath="/services"
      />
      <Layout>
        <ServicesHero />
        <ServicesContent />
        <ServicesCTA />
      </Layout>
    </>
  );
}
