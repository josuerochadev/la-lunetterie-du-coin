import Layout from '@/components/common/Layout';
import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import SectionContainer from '@/components/common/SectionContainer';
import { ServiceCard } from '@/components/common/ServiceCard';
import { useNativeScroll } from '@/hooks/useNativeScroll';
import { Seo } from '@/seo/Seo';
import { CALENDLY_URL } from '@/config/constants';
import { SERVICES_DATA } from '@/data/services';

/**
 * Page Services détaillée (Phase 3)
 *
 * Page complète présentant tous les services :
 * - Lunettes neuves
 * - Lunettes d'occasion / Recyclage
 * - Examens de vue
 * - Lentilles de contact
 * - Réparations et ajustements
 *
 * Style minimaliste cohérent avec Phase 2
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
        {/* Hero - Style homepage avec hiérarchie forte */}
        <SectionContainer id="hero" className="bg-background py-section">
          <div className="mx-auto max-w-container px-container-x">
            <div className="mx-auto max-w-5xl">
              <SimpleAnimation type="slide-up" delay={0}>
                <div className="space-y-6">
                  <h1 className="heading-page">Nos services</h1>
                  <p
                    className="leading-relaxed text-stone"
                    style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}
                  >
                    Une expertise complète pour prendre soin de votre vue, avec style et conscience
                  </p>
                </div>
              </SimpleAnimation>
            </div>
          </div>
        </SectionContainer>

        {/* Services détaillés - Layout éditorial 50/50 alterné */}
        <SectionContainer className="bg-background py-section">
          <div className="mx-auto max-w-container px-container-x">
            <div className="space-y-24 lg:space-y-32">
              {SERVICES_DATA.map((service, index) => {
                const isEven = index % 2 === 0;

                // Contenu additionnel pour les examens (conditions + CTA)
                const examensAdditionalContent =
                  service.id === 'examens' ? (
                    <>
                      <div
                        className={`${isEven ? 'border-l-4' : 'border-r-4'} border-accent/30 bg-accent/5 p-6`}
                      >
                        <h4 className="mb-3 text-body font-medium text-text">
                          Conditions pour réaliser un examen de vue en magasin :
                        </h4>
                        <ul className="space-y-2 text-body-sm text-stone">
                          <li className="flex gap-2">
                            <span>•</span>
                            <span>
                              Ordonnance de moins de 5 ans pour les 16-42 ans, ou moins de 3 ans
                              pour les 42 ans et plus
                            </span>
                          </li>
                          <li className="flex gap-2">
                            <span>•</span>
                            <span>
                              L'ordonnance ne doit pas comporter de mention contre-indiquant
                              l'examen hors cabinet médical
                            </span>
                          </li>
                          <li className="flex gap-2">
                            <span>•</span>
                            <span>
                              Non autorisé pour les personnes diabétiques ou présentant un
                              kératocône, glaucome ou cataracte
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className={isEven ? '' : 'flex justify-end'}>
                        <a
                          href={CALENDLY_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 border border-accent bg-transparent px-6 py-3 text-body font-medium text-accent transition-all hover:bg-accent hover:text-cream focus-visible:bg-accent focus-visible:text-cream"
                          aria-label="Prendre rendez-vous"
                        >
                          Prendre rendez-vous
                        </a>
                      </div>
                    </>
                  ) : undefined;

                return (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    imagePosition={isEven ? 'left' : 'right'}
                    index={index}
                    additionalContent={examensAdditionalContent}
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
                <h2 className="heading-section mb-6">Prêt à trouver la paire parfaite ?</h2>
              </SimpleAnimation>

              <SimpleAnimation type="slide-up" delay={100}>
                <p className="mb-8 text-body-lg text-stone">
                  Découvrez nos offres ou venez nous rencontrer en boutique
                </p>
              </SimpleAnimation>

              <SimpleAnimation type="slide-up" delay={200}>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <a
                    href="/offres"
                    className="inline-flex items-center gap-2 border border-accent bg-transparent px-6 py-3 text-body font-medium text-accent transition-all hover:bg-accent hover:text-cream focus-visible:bg-accent focus-visible:text-cream"
                  >
                    Connaître nos offres
                  </a>
                  <a
                    href="/contact"
                    className="inline-flex items-center gap-2 border border-accent bg-accent px-6 py-3 text-body font-medium text-cream transition-all hover:bg-accent/90 focus-visible:bg-accent/90"
                  >
                    Nous contacter
                  </a>
                </div>
              </SimpleAnimation>
            </div>
          </div>
        </SectionContainer>
      </Layout>
    </>
  );
}
