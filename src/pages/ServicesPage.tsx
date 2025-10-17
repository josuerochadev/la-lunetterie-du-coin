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
      icon: '👓',
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
      icon: '♻️',
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
      icon: '👁️',
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
      icon: '🔍',
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
      icon: '🔧',
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
                  <span className="text-body-sm font-medium uppercase tracking-wider text-stone">
                    Notre expertise
                  </span>
                  <h1
                    className="font-light uppercase leading-tight tracking-wide text-text"
                    style={{ fontSize: 'clamp(2.5rem, 4vw, 5rem)' }}
                  >
                    Nos services
                  </h1>
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

        {/* Services détaillés */}
        {services.map((service, index) => (
          <SectionContainer key={service.id} id={service.id} className="bg-background py-section">
            <div className="mx-auto max-w-container px-container-x">
              <div
                className={`grid items-start gap-12 lg:grid-cols-2 lg:gap-16 ${
                  index % 2 === 1 ? 'lg:grid-flow-dense' : ''
                }`}
              >
                {/* Contenu */}
                <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                  <SimpleAnimation type="slide-up" delay={0}>
                    <div className="mb-6 text-4xl" aria-hidden="true">
                      {service.icon}
                    </div>
                    <h2 className="text-title-md font-medium text-text">{service.title}</h2>
                  </SimpleAnimation>

                  <SimpleAnimation type="slide-up" delay={100}>
                    <p className="text-body-lg leading-relaxed text-text">{service.description}</p>
                  </SimpleAnimation>

                  <SimpleAnimation type="slide-up" delay={200}>
                    <div className="space-y-3">
                      <h3 className="text-body-lg font-medium text-text">
                        Ce que nous proposons :
                      </h3>
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
                  </SimpleAnimation>

                  {service.id === 'examens' && (
                    <SimpleAnimation type="slide-up" delay={300}>
                      <div className="mt-8 border-l-4 border-stone/30 bg-stone/5 p-6">
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
                    </SimpleAnimation>
                  )}
                </div>

                {/* Image */}
                <SimpleAnimation
                  type="slide-up"
                  delay={100}
                  className={index % 2 === 1 ? 'lg:col-start-2' : ''}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={`/images/services-${service.id}.jpg`}
                      alt={service.title}
                      className="h-full w-full object-cover object-center"
                      loading="lazy"
                    />
                  </div>
                </SimpleAnimation>
              </div>
            </div>
          </SectionContainer>
        ))}

        {/* CTA final */}
        <SectionContainer className="bg-accent py-section">
          <div className="mx-auto max-w-container px-container-x">
            <div className="mx-auto max-w-5xl text-center">
              <SimpleAnimation type="slide-up" delay={0}>
                <h2 className="mb-6 text-title-md font-medium text-cream">
                  Prêt à trouver la paire parfaite ?
                </h2>
              </SimpleAnimation>

              <SimpleAnimation type="slide-up" delay={100}>
                <p className="mb-8 text-body-lg text-cream/90">
                  Prenez rendez-vous dès maintenant ou passez nous voir en boutique
                </p>
              </SimpleAnimation>

              <SimpleAnimation type="slide-up" delay={200}>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <a
                    href={CALENDLY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button-primary bg-cream text-accent hover:bg-cream/90 hover:text-accent"
                  >
                    Prendre rendez-vous
                  </a>
                  <a
                    href="/contact"
                    className="button-primary border-cream text-cream hover:bg-cream hover:text-accent"
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
