import { SimpleAnimation } from '@/components/motion/SimpleAnimation';

/**
 * Section OffersCTA - Call-to-Action final de la page Offres
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
            <p className="mb-8 text-body-lg text-black/50">
              Passez nous voir en boutique pour en profiter
            </p>
          </SimpleAnimation>

          <SimpleAnimation type="slide-up" delay={200}>
            <a href="/contact" className="button-primary px-6 py-3 text-body">
              Nous contacter
            </a>
          </SimpleAnimation>
        </div>
      </div>
    </section>
  );
}
