// src/pages/NotFound.tsx
import Layout from '@/components/common/Layout';
import SectionContainer from '@/components/common/SectionContainer';
import LinkCTA from '@/components/common/LinkCTA';
import PageHeader from '@/components/legal/PageHeader';
import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import { Seo } from '@/seo/Seo';

export default function NotFound() {
  return (
    <>
      <Seo title="Page non trouvée" noIndex />
      <div className="relative z-base">
        <Layout>
          <SectionContainer className="pb-section pt-section-sm">
            {/* En-tête avec titre et lien retour */}
            <PageHeader title="Page non trouvée" />

            <p className="mx-auto mt-title-gap max-w-content text-body">
              Oups&nbsp;! La page que vous recherchez n'existe pas ou a été déplacée.
            </p>

            <SimpleAnimation type="slide-up" delay={100}>
              <div className="mt-12 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
                <LinkCTA to="/services">Découvrir nos services</LinkCTA>
                <LinkCTA to="/contact">Nous contacter</LinkCTA>
              </div>
            </SimpleAnimation>
          </SectionContainer>
        </Layout>
      </div>
    </>
  );
}
