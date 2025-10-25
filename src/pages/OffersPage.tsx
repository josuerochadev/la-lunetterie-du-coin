import Layout from '@/components/common/Layout';
import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import SectionContainer from '@/components/common/SectionContainer';
import { ServiceCard } from '@/components/common/ServiceCard';
import { useNativeScroll } from '@/hooks/useNativeScroll';
import { Seo } from '@/seo/Seo';
import { OFFERS_DATA } from '@/data/offers';

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
        {/* Hero - Style homepage avec hiérarchie forte */}
        <SectionContainer id="hero" className="bg-background py-section">
          <div className="mx-auto max-w-container px-container-x">
            <div className="mx-auto max-w-5xl">
              <SimpleAnimation type="slide-up" delay={0}>
                <div className="space-y-6">
                  <h1 className="heading-page">Nos offres</h1>
                  <p
                    className="leading-relaxed text-stone"
                    style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}
                  >
                    Des solutions pensées pour votre budget et pour la planète
                  </p>
                </div>
              </SimpleAnimation>
            </div>
          </div>
        </SectionContainer>

        {/* Offres détaillées - Layout éditorial 50/50 alterné */}
        <SectionContainer className="bg-background py-section">
          <div className="mx-auto max-w-container px-container-x">
            <div className="space-y-24 lg:space-y-32">
              {OFFERS_DATA.map((offer, index) => {
                const isEven = index % 2 === 0;

                return (
                  <ServiceCard
                    key={offer.id}
                    service={offer}
                    imagePosition={isEven ? 'left' : 'right'}
                    index={index}
                  />
                );
              })}
            </div>
          </div>
        </SectionContainer>

        {/* CTA final */}
        <SectionContainer className="bg-background py-section">
          <div className="mx-auto max-w-container px-container-x">
            <div className="mx-auto max-w-4xl text-center">
              <SimpleAnimation type="slide-up" delay={0}>
                <h2 className="heading-section mb-6">Prêt à profiter de nos offres ?</h2>
              </SimpleAnimation>

              <SimpleAnimation type="slide-up" delay={100}>
                <p className="mb-8 text-body-lg text-stone">
                  Passez nous voir en boutique pour en profiter
                </p>
              </SimpleAnimation>

              <SimpleAnimation type="slide-up" delay={200}>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 border border-accent bg-accent px-6 py-3 text-body font-medium text-cream transition-all hover:bg-accent/90 focus-visible:bg-accent/90"
                >
                  Nous contacter
                </a>
              </SimpleAnimation>
            </div>
          </div>
        </SectionContainer>
      </Layout>
    </>
  );
}
