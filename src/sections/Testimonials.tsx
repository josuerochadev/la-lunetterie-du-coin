import { forwardRef } from 'react';
import Quote from 'lucide-react/dist/esm/icons/quote';
import Star from 'lucide-react/dist/esm/icons/star';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import SectionContainer from '@/components/common/SectionContainer';
import { TESTIMONIALS } from '@/config/constants';

/**
 * Section Témoignages (Phase 2)
 *
 * Affiche les vrais avis clients Google Reviews dans un style minimaliste :
 * - Cards épurées avec citations authentiques
 * - Layout en grille 3 colonnes (responsive)
 * - Icône citation et étoiles
 * - Nom, date et source (Google Reviews)
 *
 * Style inspiré Kinfolk/La Pima :
 * - Fond crème
 * - Typographie claire
 * - Espaces généreux
 * - Focus sur l'authenticité
 *
 * @component
 * @returns {JSX.Element} La section Témoignages avec avis Google
 */
const Testimonials = forwardRef<HTMLElement>(() => {
  return (
    <SectionContainer
      id="testimonials"
      className="bg-surface py-section"
      aria-labelledby="testimonials-title"
    >
      <div className="container mx-auto px-container-x">
        {/* En-tête */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <SimpleAnimation type="slide-up" delay={0}>
            <h2 id="testimonials-title" className="mb-4 text-title-md font-medium text-text">
              Ils nous font confiance
            </h2>
          </SimpleAnimation>

          <SimpleAnimation type="slide-up" delay={100}>
            <p className="text-body-lg text-stone">
              Découvrez les avis authentiques de nos clients
            </p>
          </SimpleAnimation>
        </div>

        {/* Grille de témoignages */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial, index) => (
            <SimpleAnimation key={testimonial.id} type="slide-up" delay={index * 100}>
              <article className="flex h-full flex-col rounded-sm border border-stone/20 bg-background p-8 shadow-soft transition-all duration-300 hover:shadow-card">
                {/* En-tête avec icône citation et étoiles */}
                <div className="mb-6 flex items-start justify-between">
                  <Quote className="h-8 w-8 text-accent/40" aria-hidden="true" strokeWidth={1.5} />
                  <div className="flex gap-1" aria-label={`Note: ${testimonial.rating} sur 5`}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-accent text-accent"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                </div>

                {/* Citation */}
                <blockquote className="mb-6 flex-1">
                  <p className="text-body leading-relaxed text-text">{testimonial.quote}</p>
                </blockquote>

                {/* Auteur et source */}
                <footer className="border-t border-stone/10 pt-6">
                  <cite className="not-italic">
                    <div className="mb-1 text-body font-medium text-text">{testimonial.name}</div>
                    <div className="flex items-center gap-2 text-body-sm text-stone">
                      <span>{testimonial.role}</span>
                      {testimonial.date && (
                        <>
                          <span aria-hidden="true">•</span>
                          <time>{testimonial.date}</time>
                        </>
                      )}
                    </div>
                  </cite>
                </footer>
              </article>
            </SimpleAnimation>
          ))}
        </div>

        {/* CTA avec lien Google Reviews */}
        <SimpleAnimation type="slide-up" delay={300}>
          <div className="mt-16 text-center">
            <p className="mb-4 text-body text-stone">
              Plus de 100 avis clients avec une note moyenne de 4.9/5
            </p>
            <a
              href="https://www.google.com/maps/place/La+Lunetterie+Du+Coin+Neuf+%26+Occasion/@48.5823394,7.7453277,17z/data=!4m8!3m7!1s0x4796c84f95e5e877:0x88d0f0f0f0f0f0f0!8m2!3d48.5823394!4d7.7479026!9m1!1b1!16s%2Fg%2F11c1qx0x0x"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-sm border border-accent bg-transparent px-8 py-4 text-body font-medium text-accent transition-all hover:bg-accent hover:text-cream focus-visible:bg-accent focus-visible:text-cream"
            >
              Voir tous nos avis Google
            </a>
          </div>
        </SimpleAnimation>
      </div>
    </SectionContainer>
  );
});

Testimonials.displayName = 'Testimonials';

export default Testimonials;
