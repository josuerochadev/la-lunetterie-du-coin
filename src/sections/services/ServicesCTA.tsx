import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import LinkCTA from '@/components/common/LinkCTA';

/**
 * Section ServicesCTA - Call-to-Action final de la page Services
 */
export default function ServicesCTA() {
  return (
    <section className="relative w-full bg-background py-section">
      <div className="mx-auto max-w-container px-container-x">
        <div className="mx-auto max-w-4xl text-center">
          <SimpleAnimation type="slide-up" delay={0}>
            <h2 className="heading-section mb-6">Prêt à trouver la paire parfaite ?</h2>
          </SimpleAnimation>

          <SimpleAnimation type="slide-up" delay={100}>
            <p className="mb-8 text-body-lg text-black/50">
              Découvrez nos offres ou venez nous rencontrer en boutique
            </p>
          </SimpleAnimation>

          <SimpleAnimation type="slide-up" delay={200}>
            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
              <LinkCTA href="/offres">Découvrir nos offres</LinkCTA>
              <LinkCTA href="/contact">Nous contacter</LinkCTA>
            </div>
          </SimpleAnimation>
        </div>
      </div>
    </section>
  );
}
