import { forwardRef } from 'react';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import SectionContainer from '@/components/common/SectionContainer';
import { SERVICES } from '@/config/constants';

/**
 * Section Services redesignée en style minimaliste (Phase 2)
 *
 * 4 services en grille épurée :
 * - Lunettes neuves
 * - Lunettes d'occasion
 * - Examens de vue
 * - Lentilles de contact
 *
 * Style inspiré Kinfolk/La Pima :
 * - Cartes minimalistes avec fond crème/sable
 * - Icônes émojis simples
 * - Bordure subtile
 * - Hover : élévation + lien orange
 *
 * @component
 * @returns {JSX.Element} La section Services minimaliste avec grille 2x2
 */
const ServicesMinimal = forwardRef<HTMLElement>(() => {
  return (
    <SectionContainer
      id="services"
      className="bg-background py-section"
      aria-labelledby="services-title"
    >
      <div className="container mx-auto px-container-x">
        {/* En-tête */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <SimpleAnimation type="slide-up" delay={0}>
            <h2 id="services-title" className="mb-4 text-title-md font-medium text-text">
              Nos services
            </h2>
          </SimpleAnimation>

          <SimpleAnimation type="slide-up" delay={100}>
            <p className="text-body-lg text-stone">
              Une expertise complète pour prendre soin de votre vue
            </p>
          </SimpleAnimation>
        </div>

        {/* Grille de services */}
        <div className="grid gap-8 sm:grid-cols-2 lg:gap-12">
          {SERVICES.map((service, index) => (
            <SimpleAnimation key={service.title} type="slide-up" delay={index * 100}>
              <article className="group rounded-sm border border-stone/20 bg-surface p-8 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                {/* Icône */}
                <div
                  className="mb-6 text-4xl transition-transform duration-300 group-hover:scale-110"
                  aria-hidden="true"
                >
                  {service.icon}
                </div>

                {/* Titre */}
                <h3 className="mb-3 text-title-sm font-medium text-text">{service.title}</h3>

                {/* Description */}
                <p className="mb-6 text-body leading-relaxed text-stone">{service.description}</p>

                {/* Lien */}
                <a
                  href={service.link}
                  className="inline-flex items-center gap-2 text-body font-medium text-text transition-colors hover:text-accent focus-visible:text-accent"
                  aria-label={`En savoir plus sur ${service.title}`}
                >
                  Découvrir
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </a>
              </article>
            </SimpleAnimation>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
});

export default ServicesMinimal;
