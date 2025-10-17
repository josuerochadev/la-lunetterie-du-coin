import { forwardRef } from 'react';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';

/**
 * Section Services - Design éditorial Kinfolk
 *
 * 4 services en cards verticales avec images :
 * - Lunettes neuves
 * - Lunettes d'occasion
 * - Examens de vue
 * - Lentilles de contact
 *
 * Style éditorial minimaliste :
 * - Images pleine largeur en haut (ratio portrait)
 * - Texte sur fond crème en dessous
 * - Grille 2 colonnes responsive
 * - Pas de bordures, design épuré
 *
 * @component
 * @returns {JSX.Element} La section Services avec cards verticales
 */
const ServicesMinimal = forwardRef<HTMLElement>(() => {
  const services = [
    {
      title: 'Lunettes neuves',
      description:
        'Large sélection de montures contemporaines et intemporelles. Marques indépendantes et créateurs locaux.',
      image: '/images/homepage-services-new-glasses.jpg',
      link: '/services#neuves',
    },
    {
      title: "Lunettes d'occasion",
      description:
        'Montures de seconde main restaurées avec soin. Du vintage rare aux modèles récents à petits prix.',
      image: '/images/homepage-services-second-hand.jpg',
      link: '/services#occasion',
    },
    {
      title: 'Examens de vue',
      description:
        "Contrôle visuel complet réalisé par Romain, opticien diplômé avec 10 ans d'expérience.",
      image: '/images/homepage-services-exam.jpg',
      link: '/services#examens',
    },
    {
      title: 'Lentilles de contact',
      description:
        'Nous sommes revendeurs de toutes marques (Alcon, Acuvue, CooperVision, etc.). Essai et adaptation sur mesure.',
      image: '/images/homepage-services-contact-lenses.jpg',
      link: '/services#lentilles',
    },
  ];

  return (
    <section
      id="services"
      className="relative w-full bg-background py-section"
      aria-labelledby="services-title"
    >
      <div className="mx-auto max-w-container px-container-x">
        {/* En-tête */}
        <div className="mx-auto mb-16 max-w-6xl text-center">
          <SimpleAnimation type="slide-up" delay={0}>
            <h2 id="services-title" className="heading-section mb-4">
              Nos services
            </h2>
          </SimpleAnimation>

          <SimpleAnimation type="slide-up" delay={100}>
            <p className="text-body-lg text-stone">
              Une expertise complète pour prendre soin de votre vue
            </p>
          </SimpleAnimation>
        </div>

        {/* Grille de services - 2 colonnes sur desktop, 1 sur mobile */}
        <div className="grid gap-8 sm:grid-cols-2 lg:gap-12">
          {services.map((service, index) => (
            <SimpleAnimation key={service.title} type="fade" delay={index * 100}>
              <article className="group relative">
                {/* Image pleine hauteur avec texte superposé */}
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Boîte de texte superposée en bas */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-center p-4 sm:p-6">
                    <div className="w-full space-y-3 bg-background px-4 py-6 sm:space-y-4 sm:px-6 sm:py-8">
                      <h3 className="heading-subsection">{service.title}</h3>

                      <p className="text-body-sm leading-relaxed text-stone sm:text-body">
                        {service.description}
                      </p>

                      <a
                        href={service.link}
                        className="inline-flex items-center gap-2 text-body-sm font-medium text-accent transition-colors hover:text-text focus-visible:text-text sm:text-body"
                        aria-label={`En savoir plus sur ${service.title}`}
                      >
                        En savoir plus
                        <ArrowRight
                          className="h-4 w-4 transition-transform group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            </SimpleAnimation>
          ))}
        </div>

        {/* Bouton CTA vers la page Services complète */}
        <div className="mt-16 text-center">
          <SimpleAnimation type="slide-up" delay={400}>
            <a
              href="/services"
              className="inline-flex items-center gap-2 border border-accent bg-transparent px-6 py-3 text-body font-medium text-accent transition-all hover:bg-accent hover:text-cream focus-visible:bg-accent focus-visible:text-cream"
              aria-label="Découvrir tous nos services"
            >
              Découvrir tous nos services
            </a>
          </SimpleAnimation>
        </div>
      </div>
    </section>
  );
});

export default ServicesMinimal;
