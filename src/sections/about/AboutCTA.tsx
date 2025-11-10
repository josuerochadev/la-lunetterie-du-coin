import { SimpleAnimation } from '@/components/motion/SimpleAnimation';

/**
 * Section CTA Finale de la page À propos
 *
 * Call-to-action avec liens vers Services et Contact.
 *
 * @component
 * @returns {JSX.Element} CTA section
 */
export default function AboutCTA() {
  return (
    <section className="relative w-full bg-background py-section">
      <div className="mx-auto max-w-container px-container-x">
        <div className="mx-auto max-w-4xl text-center">
          <SimpleAnimation type="slide-up" delay={0}>
            <h2 className="heading-section mb-6">Envie d'en savoir plus ?</h2>
          </SimpleAnimation>

          <SimpleAnimation type="slide-up" delay={100}>
            <p className="mb-8 text-body-lg text-stone">
              Découvrez nos services ou venez nous rencontrer en boutique
            </p>
          </SimpleAnimation>

          <SimpleAnimation type="slide-up" delay={200}>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/services"
                className="inline-flex items-center gap-2 border border-accent bg-transparent px-6 py-3 text-body font-medium text-accent transition-all hover:bg-accent hover:text-cream focus-visible:bg-accent focus-visible:text-cream"
              >
                Découvrir nos services
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 border border-accent bg-accent px-6 py-3 text-body font-medium text-cream transition-all hover:bg-accent/90 focus-visible:bg-accent/90"
              >
                Nous contacter
              </a>
            </div>
          </SimpleAnimation>
        </div>
      </div>
    </section>
  );
}
