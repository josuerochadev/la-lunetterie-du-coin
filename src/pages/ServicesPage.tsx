import Layout from '@/components/common/Layout';
import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import SectionContainer from '@/components/common/SectionContainer';
import { useNativeScroll } from '@/hooks/useNativeScroll';
import { Seo } from '@/seo/Seo';
import { CALENDLY_URL } from '@/config/constants';

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

  const services = [
    {
      id: 'neuves',
      title: 'Lunettes neuves',
      image: '/images/services-new-glasses-sun.jpg',
      description: 'Une sélection pointue de créateurs indépendants et de marques iconiques.',
      details: [
        'Large choix de montures contemporaines et intemporelles',
        'Marques indépendantes et créateurs locaux',
        'Montures vintage et modèles rares',
        'Verres de qualité : Essilor, Zeiss, Hoya',
        'Verres progressifs dernière génération',
        'Verres anti-lumière bleue',
        'Traitement antireflet durci',
      ],
    },
    {
      id: 'occasion',
      title: "Lunettes d'occasion",
      image: '/images/services-second-hand-glasses.jpg',
      description:
        'Des montures de seconde main restaurées avec soin, pour un style unique à petit prix.',
      details: [
        'Montures vintage authentiques',
        'Modèles récents à prix réduits',
        'Toutes restaurées et nettoyées professionnellement',
        'Contrôle qualité systématique',
        'Du rare au classique',
        'Prix accessibles',
        'Stock renouvelé régulièrement',
      ],
    },
    {
      id: 'examens',
      title: 'Examens de vue',
      image: '/images/services-exams-machine.png',
      description:
        "Contrôle visuel complet réalisé par Romain, opticien diplômé avec 10 ans d'expérience.",
      details: [
        'Examen de vue complet (30 min)',
        'Réfraction précise',
        'Test de vision binoculaire',
        'Mesure de la pression intraoculaire',
        'Conseils personnalisés',
        'Prise en charge mutuelle possible',
        'Sur rendez-vous ou en visite libre',
      ],
    },
    {
      id: 'lentilles',
      title: 'Lentilles de contact',
      image: '/images/services-contact-lenses-shop-mirror.png',
      description: 'Nous sommes revendeurs de toutes marques avec essai et adaptation sur mesure.',
      details: [
        'Revendeurs de toutes marques (Alcon, Acuvue, CooperVision, etc.)',
        'Lentilles journalières, mensuelles, annuelles',
        'Lentilles souples et rigides',
        'Lentilles toriques (astigmatisme)',
        'Lentilles progressives',
        'Essai gratuit en magasin',
        'Suivi et adaptation personnalisée',
      ],
    },
    {
      id: 'reparations',
      title: 'Réparations & Ajustements',
      image: '/images/services-reparations.jpg',
      description: 'Service après-vente complet pour garder vos lunettes en parfait état.',
      details: [
        'Ajustements gratuits à vie pour nos clients',
        'Nettoyage professionnel gratuit',
        'Remplacement plaquettes gratuit pour nos clients',
        'Visserie gratuite pour nos clients',
        'Réparation de charnières',
        'Remplacement de branches',
        'Service rapide (souvent immédiat)',
      ],
    },
  ];

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
              {services.map((service, index) => {
                const isEven = index % 2 === 0;

                return (
                  <SimpleAnimation key={service.id} type="fade" delay={index * 100}>
                    <article
                      id={service.id}
                      className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16"
                    >
                      {isEven ? (
                        // Layout pair : Image gauche (50%) - Texte droite (50%)
                        <>
                          <div className="relative w-full">
                            <div className="relative aspect-[2/3] w-full overflow-hidden">
                              <img
                                src={service.image}
                                alt={service.title}
                                className="h-full w-full object-cover"
                                loading="lazy"
                              />
                            </div>
                          </div>
                          <div className="flex min-h-full items-center">
                            <div className="space-y-6">
                              {/* Titre */}
                              <h2 className="heading-section">{service.title}</h2>

                              {/* Description */}
                              <p className="text-body-lg leading-relaxed text-text">
                                {service.description}
                              </p>

                              {/* Détails - Boîte centralisée avec bordure */}
                              <div className="border border-charcoal p-6">
                                <ul className="space-y-2">
                                  {service.details.map((detail, i) => (
                                    <li key={i} className="flex gap-3 text-body text-stone">
                                      <span className="text-accent" aria-hidden="true">
                                        •
                                      </span>
                                      <span>{detail}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Conditions spéciales pour examens */}
                              {service.id === 'examens' && (
                                <div className="border-l-4 border-accent/30 bg-accent/5 p-6">
                                  <h4 className="mb-3 text-body font-medium text-text">
                                    Conditions pour réaliser un examen de vue en magasin :
                                  </h4>
                                  <ul className="space-y-2 text-body-sm text-stone">
                                    <li className="flex gap-2">
                                      <span>•</span>
                                      <span>
                                        Ordonnance de moins de 5 ans pour les 16-42 ans, ou moins de
                                        3 ans pour les 42 ans et plus
                                      </span>
                                    </li>
                                    <li className="flex gap-2">
                                      <span>•</span>
                                      <span>
                                        L'ordonnance ne doit pas comporter de mention
                                        contre-indiquant l'examen hors cabinet médical
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
                              )}

                              {/* Bouton CTA pour examens */}
                              {service.id === 'examens' && (
                                <a
                                  href={CALENDLY_URL}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 border border-accent bg-transparent px-6 py-3 text-body font-medium text-accent transition-all hover:bg-accent hover:text-cream focus-visible:bg-accent focus-visible:text-cream"
                                  aria-label="Prendre rendez-vous"
                                >
                                  Prendre rendez-vous
                                </a>
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        // Layout impair : Texte gauche (50%) - Image droite (50%)
                        <>
                          <div className="flex min-h-full items-center justify-end">
                            <div className="space-y-6 text-right">
                              {/* Titre */}
                              <h2 className="heading-section">{service.title}</h2>

                              {/* Description */}
                              <p className="text-body-lg leading-relaxed text-text">
                                {service.description}
                              </p>

                              {/* Détails - Boîte centralisée avec bordure */}
                              <div className="border border-charcoal p-6 text-left">
                                <ul className="space-y-2">
                                  {service.details.map((detail, i) => (
                                    <li key={i} className="flex gap-3 text-body text-stone">
                                      <span className="text-accent" aria-hidden="true">
                                        •
                                      </span>
                                      <span>{detail}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Conditions spéciales pour examens */}
                              {service.id === 'examens' && (
                                <div className="border-r-4 border-accent/30 bg-accent/5 p-6 text-left">
                                  <h4 className="mb-3 text-body font-medium text-text">
                                    Conditions pour réaliser un examen de vue en magasin :
                                  </h4>
                                  <ul className="space-y-2 text-body-sm text-stone">
                                    <li className="flex gap-2">
                                      <span>•</span>
                                      <span>
                                        Ordonnance de moins de 5 ans pour les 16-42 ans, ou moins de
                                        3 ans pour les 42 ans et plus
                                      </span>
                                    </li>
                                    <li className="flex gap-2">
                                      <span>•</span>
                                      <span>
                                        L'ordonnance ne doit pas comporter de mention
                                        contre-indiquant l'examen hors cabinet médical
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
                              )}

                              {/* Bouton CTA pour examens */}
                              {service.id === 'examens' && (
                                <div className="flex justify-end">
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
                              )}
                            </div>
                          </div>
                          <div className="relative w-full">
                            <div className="relative aspect-[2/3] w-full overflow-hidden">
                              <img
                                src={service.image}
                                alt={service.title}
                                className="h-full w-full object-cover"
                                loading="lazy"
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </article>
                  </SimpleAnimation>
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
