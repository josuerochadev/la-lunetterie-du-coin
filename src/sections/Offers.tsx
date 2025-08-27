import { useState } from 'react';

import SectionTitle from '@/components/common/SectionTitle';
import { OFFERS } from '@/config/constants';
import OfferCard from '@/components/offers/OfferCard';

/**
 * Section "Nos Offres" - Cartes expandables des offres commerciales
 *
 * Affiche les offres de l'entreprise (recyclage, deuxième paire...) sous forme
 * de cartes interactives expandables. Gère l'état d'expansion multiple et
 * les animations pour une expérience utilisateur fluide.
 *
 * Fonctionnalités :
 * - Grid responsive 1 col mobile → 2 cols desktop
 * - Expansion/collapse individuelle des cartes
 * - Animations tilt + spring pour les interactions
 * - Accessibilité complète (ARIA + navigation clavier)
 *
 * @returns Section des offres avec cartes interactives
 */
export default function Offers() {
  const [openCards, setOpenCards] = useState<number[]>([]);

  const toggleCard = (id: number) => {
    setOpenCards((prev) =>
      prev.includes(id) ? prev.filter((cardId) => cardId !== id) : [...prev, id],
    );
  };

  return (
    <section id="offers" className="w-full px-container-x py-section">
      <SectionTitle title="Nos Offres" />
      <div className="mx-auto grid max-w-content grid-cols-1 gap-section-gap md:grid-cols-2">
        {OFFERS.map((offer, index) => (
          <OfferCard
            key={offer.id}
            offer={offer}
            isOpen={openCards.includes(offer.id)}
            onToggle={toggleCard}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
