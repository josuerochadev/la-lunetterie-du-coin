import { SimpleAnimation } from '@/components/motion/SimpleAnimation';

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
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a href="/offres" className="button-secondary px-6 py-3 text-body">
                Connaître nos offres
              </a>
              <a href="/contact" className="button-primary px-6 py-3 text-body">
                Nous contacter
              </a>
            </div>
          </SimpleAnimation>
        </div>
      </div>
    </section>
  );
}
