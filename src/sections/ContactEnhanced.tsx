import { forwardRef } from 'react';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';

/**
 * Section Contact - Homepage CTA
 *
 * Section simplifiée sur la homepage avec :
 * - Titre "Nous contacter"
 * - Phrase d'accroche
 * - Bouton CTA bordered (Option A) pointant vers /contact
 *
 * Style éditorial minimal cohérent avec les autres sections
 *
 * @component
 * @returns {JSX.Element} La section Contact CTA
 */
const ContactEnhanced = forwardRef<HTMLElement>(() => {
  return (
    <section
      id="contact"
      className="relative w-full bg-background py-section"
      aria-labelledby="contact-title"
    >
      <div className="mx-auto max-w-container px-container-x">
        <div className="mx-auto max-w-6xl text-center">
          {/* En-tête */}
          <SimpleAnimation type="slide-up" delay={0}>
            <h2 id="contact-title" className="heading-section mb-4">
              Nous contacter
            </h2>
          </SimpleAnimation>

          <SimpleAnimation type="slide-up" delay={100}>
            <p className="mb-8 text-body-lg text-stone">
              Une question ? Besoin d'un conseil ? Nous sommes là pour vous accompagner
            </p>
          </SimpleAnimation>

          {/* CTA Button - Option A: bordered minimal */}
          <SimpleAnimation type="fade" delay={200}>
            <a
              href="/contact"
              className="group inline-flex items-center gap-2 border border-accent bg-transparent px-8 py-4 text-body font-medium text-accent transition-all hover:bg-accent hover:text-cream focus-visible:bg-accent focus-visible:text-cream"
            >
              Nous contacter
              <ArrowRight
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </a>
          </SimpleAnimation>
        </div>
      </div>
    </section>
  );
});

ContactEnhanced.displayName = 'ContactEnhanced';

export default ContactEnhanced;
