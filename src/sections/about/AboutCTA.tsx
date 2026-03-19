import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import LinkCTA from '@/components/common/LinkCTA';

/**
 * Section CTA Finale de la page À propos
 *
 * Call-to-action avec liens vers Services et Contact.
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
            <p className="mb-8 text-body-lg text-black/50">
              Découvrez nos services ou venez nous rencontrer en boutique
            </p>
          </SimpleAnimation>

          <SimpleAnimation type="slide-up" delay={200}>
            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
              <LinkCTA href="/services">Découvrir nos services</LinkCTA>
              <LinkCTA href="/contact">Nous contacter</LinkCTA>
            </div>
          </SimpleAnimation>
        </div>
      </div>
    </section>
  );
}
