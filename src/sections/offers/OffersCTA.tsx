import { SimpleAnimation } from '@/components/motion/SimpleAnimation';

/**
 * Section OffersCTA - Call-to-Action final de la page Offres
 *
 * Section finale invitant à contacter la boutique.
 * Style cohérent avec les autres pages.
 *
 * @component
 * @returns {JSX.Element} Section CTA de la page Offres
 */
export default function OffersCTA() {
  return (
    <section className="relative w-full bg-background py-section">
      <div className="mx-auto max-w-container px-container-x">
        <div className="mx-auto max-w-4xl text-center">
          <SimpleAnimation type="slide-up" delay={0}>
            <h2 className="heading-section mb-6">Prêt à profiter de nos offres ?</h2>
          </SimpleAnimation>

          <SimpleAnimation type="slide-up" delay={100}>
            <p className="mb-8 text-body-lg text-stone">
              Passez nous voir en boutique pour en profiter
            </p>
          </SimpleAnimation>

          <SimpleAnimation type="slide-up" delay={200}>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 border border-accent bg-accent px-6 py-3 text-body font-medium text-cream transition-all hover:bg-accent/90 focus-visible:bg-accent/90"
            >
              Nous contacter
            </a>
          </SimpleAnimation>
        </div>
      </div>
    </section>
  );
}
