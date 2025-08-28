import type React from 'react';
import { AnimatePresence, m } from 'framer-motion';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';

import Picture from '../common/Picture';

import TiltCard from '@/components/motion/interactive/TiltCard';
import AnimatedItem from '@/components/motion/AnimatedItem';
import { isToggleKey } from '@/lib/keyboard';
import { cn } from '@/lib/cn';

type Offer = {
  id: number;
  imageBase: string;
  title: string;
  summary: string;
  details: string;
};

type OfferCardProps = {
  offer: Offer;
  isOpen: boolean;
  // eslint-disable-next-line no-unused-vars
  onToggle: (id: number) => void;
  index: number;
};

/**
 * Composant `OfferCard` - Carte interactive d'offre avec animations
 *
 * Affiche une carte expandable avec effet tilt, permettant de basculer entre
 * résumé et détails complets d'une offre. Gère l'accessibilité et les animations fluides.
 *
 * @param offer - Objet offre (id, title, imageBase, summary, details)
 * @param isOpen - État d'expansion de la carte
 * @param onToggle - Callback de basculement d'état (reçoit offer.id)
 * @param index - Index pour l'animation d'entrée
 *
 * @returns Carte d'offre interactive avec animations et accessibilité complète
 */
export default function OfferCard({ offer, isOpen, onToggle, index }: OfferCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle(offer.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isToggleKey(e)) {
      e.preventDefault();
      e.stopPropagation();
      onToggle(offer.id);
    }
  };

  return (
    <AnimatedItem index={index}>
      <TiltCard>
        <button
          type="button"
          className="focus-style group relative h-card w-full cursor-pointer overflow-hidden rounded-card shadow-card transition-all duration-300 hover:shadow-lg"
          style={{
            touchAction: 'manipulation',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none',
          }}
          aria-expanded={isOpen}
          aria-controls={`offer-panel-${offer.id}`}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
        >
          <Picture
            srcBase={offer.imageBase}
            alt={offer.title}
            className="absolute inset-0 -z-base h-full w-full object-cover"
          />

          <m.section
            id={`offer-panel-${offer.id}`}
            aria-labelledby={`offer-title-${offer.id}`}
            className={cn(
              'pointer-events-none absolute inset-4 z-10 flex w-auto flex-col justify-start rounded-card bg-primary/30 p-section-gap text-accent shadow-card backdrop-blur-2xl transition-all duration-500',
            )}
            initial={false}
            animate={{
              height: isOpen ? '95%' : '50%',
            }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          >
            <h3
              id={`offer-title-${offer.id}`}
              className="mb-4 text-left font-serif text-title-lg font-bold text-accent transition-colors duration-200 group-hover:text-accent"
            >
              {offer.title}
            </h3>
            <AnimatePresence mode="wait">
              <m.div
                key={isOpen ? 'details' : 'summary'}
                initial={{
                  opacity: 0,
                  height: 0,
                  y: isOpen ? 10 : -10,
                }}
                animate={{
                  opacity: 1,
                  height: 'auto',
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                  y: isOpen ? -10 : 10,
                }}
                transition={{
                  duration: 0.5,
                  ease: 'easeInOut',
                  opacity: { duration: 0.3 },
                }}
                className="overflow-hidden"
                style={{ pointerEvents: 'none' }}
              >
                <div
                  className={cn(
                    'max-w-[90%] whitespace-pre-line text-left text-body leading-snug',
                    isOpen ? 'border-l-2 border-orange pl-4 font-medium' : 'text-accent/90',
                  )}
                >
                  {isOpen ? (
                    <div className="space-y-xs">
                      <p className="text-body-sm font-semibold uppercase tracking-wide text-accent">
                        Détails
                      </p>
                      <p>{offer.details}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="mb-1 text-body-sm font-semibold uppercase tracking-wide text-orange">
                        Résumé
                      </p>
                      <p>{offer.summary}</p>
                    </div>
                  )}
                </div>
              </m.div>
            </AnimatePresence>
            <div className="mt-auto flex items-center justify-center gap-2 transition-colors duration-200 group-hover:text-accent">
              <span className="text-body-sm font-medium">
                {isOpen ? 'Réduire' : 'En savoir plus'}
              </span>
              <m.div
                animate={{
                  rotate: isOpen ? 180 : 0,
                  scale: isOpen ? 0.9 : 1,
                }}
                transition={{
                  duration: 0.3,
                  ease: 'easeInOut',
                }}
              >
                <ChevronDown className="h-4 w-4 text-orange" aria-hidden="true" />
              </m.div>
            </div>
          </m.section>
        </button>
      </TiltCard>
    </AnimatedItem>
  );
}
