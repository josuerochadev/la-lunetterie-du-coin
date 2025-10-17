import { forwardRef } from 'react';
import Star from 'lucide-react/dist/esm/icons/star';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import { TESTIMONIALS } from '@/config/constants';

/**
 * Section Témoignages - Design éditorial Kinfolk
 *
 * Affiche les vrais avis clients Google Reviews dans un style minimaliste :
 * - Layout 2 colonnes pour plus d'espace
 * - Pas de bordures ni ombres, design flat
 * - Guillemets typographiques au lieu d'icône
 * - Étoiles et informations client simplifiées
 *
 * Style éditorial :
 * - Fond crème unifié (bg-background)
 * - Typographie claire et espacée
 * - Bordure supérieure subtile pour séparer
 * - Focus sur l'authenticité des témoignages
 *
 * @component
 * @returns {JSX.Element} La section Témoignages en style éditorial
 */
const Testimonials = forwardRef<HTMLElement>(() => {
  return (
    <section
      id="testimonials"
      className="relative w-full bg-background py-section"
      aria-labelledby="testimonials-title"
    >
      <div className="mx-auto max-w-container px-container-x">
        {/* En-tête */}
        <div className="mx-auto mb-16 max-w-6xl text-center">
          <SimpleAnimation type="slide-up" delay={0}>
            <h2 id="testimonials-title" className="heading-section mb-4">
              Ils nous font confiance
            </h2>
          </SimpleAnimation>

          <SimpleAnimation type="slide-up" delay={100}>
            <p className="text-body-lg text-stone">
              Découvrez les avis authentiques de nos clients
            </p>
          </SimpleAnimation>
        </div>

        {/* Grille de témoignages - 2 colonnes */}
        <div className="grid gap-12 md:grid-cols-2 lg:gap-16">
          {TESTIMONIALS.map((testimonial, index) => (
            <SimpleAnimation key={testimonial.id} type="fade" delay={index * 100}>
              <article className="border-t border-stone/20 pt-8">
                {/* Étoiles en haut */}
                <div className="mb-6 flex gap-1" aria-label={`Note: ${testimonial.rating} sur 5`}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-accent text-accent" aria-hidden="true" />
                  ))}
                </div>

                {/* Citation avec guillemets typographiques */}
                <blockquote className="mb-6">
                  <p className="text-body-lg leading-relaxed text-text">"{testimonial.quote}"</p>
                </blockquote>

                {/* Auteur et date */}
                <footer>
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
            <p className="mb-6 text-body text-stone">
              Plus de 100 avis clients avec une note moyenne de 4.9/5
            </p>
            <a
              href="https://www.google.com/maps/place/La+Lunetterie+Du+Coin+Neuf+%26+Occasion/@48.5823394,7.7453277,17z/data=!4m8!3m7!1s0x4796c84f95e5e877:0x88d0f0f0f0f0f0f0!8m2!3d48.5823394!4d7.7479026!9m1!1b1!16s%2Fg%2F11c1qx0x0x"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-body font-medium text-accent transition-colors hover:text-text focus-visible:text-text"
            >
              Voir tous nos avis Google
              <ArrowRight
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </a>
          </div>
        </SimpleAnimation>
      </div>
    </section>
  );
});

Testimonials.displayName = 'Testimonials';

export default Testimonials;
