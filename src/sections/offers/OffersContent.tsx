import { OfferEditorialCard } from '@/components/offers/OfferEditorialCard';
import { OFFERS_DATA } from '@/data/offers';

/**
 * Section OffersContent - Contenu principal de la page Offres
 *
 * Affiche la liste des offres en layout éditorial 50/50 alterné.
 * Utilise OfferEditorialCard pour chaque offre.
 *
 * @component
 * @returns {JSX.Element} Section contenu de la page Offres
 */
export default function OffersContent() {
  return (
    <section className="relative w-full bg-background py-section">
      <div className="mx-auto max-w-container px-container-x">
        <div className="space-y-24 lg:space-y-32">
          {OFFERS_DATA.map((offer, index) => {
            const isEven = index % 2 === 0;

            return (
              <OfferEditorialCard
                key={offer.id}
                offer={offer}
                imagePosition={isEven ? 'left' : 'right'}
                index={index}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
