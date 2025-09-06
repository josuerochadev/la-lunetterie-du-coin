import { useState } from 'react';

import { OptimizedAnimateItem } from '@/components/motion/OptimizedAnimateItem';
import SectionContainer from '@/components/common/SectionContainer';
import SectionTitle from '@/components/common/SectionTitle';
import { SERVICES } from '@/config/constants';
import ServiceCard from '@/components/services/ServiceCard';
import ServiceThumbnail from '@/components/services/ServiceThumbnail';
import Picture from '@/components/common/Picture';

/**
 * Composant principal pour la section "Nos Services".
 *
 * Affiche une liste de services avec une image principale animée, des miniatures pour la sélection,
 * et une carte détaillée du service sélectionné. Permet à l'utilisateur de naviguer entre les différents
 * services proposés via des miniatures interactives.
 *
 * @component
 * @returns {JSX.Element} La section des services avec navigation et animation.
 *
 * @example
 * <Services />
 */

export default function Services() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = SERVICES[selectedIndex];

  return (
    <SectionContainer
      id="services"
      className="bg-forest relative text-accent shadow-xl"
      overlayClassName="bg-transparent"
    >
      <SectionTitle title="Nos Services" />

      <div className="mx-auto flex flex-col items-center md:flex-row md:items-center md:justify-center">
        {/* Colonne gauche : image + miniatures */}
        <OptimizedAnimateItem
          index={0}
          type="slide-up"
          threshold={0.35}
          className="flex flex-col items-center px-container-x py-container-y"
        >
          {/* Image principale - simple transition avec CSS */}
          <div
            key={selected.imageBase}
            className="simple-fade-in-scale h-auto w-service-img max-w-full"
          >
            <Picture
              srcBase={selected.imageBase}
              alt={selected.title}
              width={857}
              height={855}
              sizes="(min-width: 1024px) 42vw, (min-width: 768px) 60vw, 90vw"
              className="h-auto w-full object-contain"
            />
          </div>

          <div
            role="tablist"
            aria-label="Liste des services"
            className="mt-3 flex w-full justify-center gap-word-gap"
          >
            {SERVICES.map((service, index) => (
              <OptimizedAnimateItem
                key={service.title}
                index={index + 1}
                type="fade"
                threshold={0.35}
              >
                <ServiceThumbnail
                  imageBase={service.imageBase}
                  title={service.title}
                  isActive={selectedIndex === index}
                  index={index}
                  onClick={() => setSelectedIndex(index)}
                />
              </OptimizedAnimateItem>
            ))}
          </div>
        </OptimizedAnimateItem>

        {/* Colonne droite : carte de service */}
        <OptimizedAnimateItem
          index={1}
          type="slide-up"
          threshold={0.35}
          className="relative w-[clamp(18rem,42vw,120rem)] self-center"
        >
          <ServiceCard key={selected.title} service={selected} />
        </OptimizedAnimateItem>
      </div>
    </SectionContainer>
  );
}
