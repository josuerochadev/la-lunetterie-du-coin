import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import LinkCTA from '@/components/common/LinkCTA';

/**
 * Section CTA finale — version légère pour pages secondaires.
 * Pas de zoom scroll-driven, juste des entrées staggerées au viewport.
 */
export default function AboutCTA() {
  return (
    <section
      className="relative flex min-h-screen w-full items-center bg-accent"
      data-navbar-theme="dark"
    >
      <div className="mx-auto max-w-container px-container-x py-section">
        <div className="mx-auto max-w-4xl text-center">
          <SimpleAnimation type="slide-up" delay={0}>
            <h2 className="heading-section text-black">Envie d&apos;en savoir plus ?</h2>
          </SimpleAnimation>

          <SimpleAnimation type="slide-up" delay={100}>
            <p className="mt-6 text-body-lg text-black/50">
              Découvrez nos services ou venez nous rencontrer en boutique
            </p>
          </SimpleAnimation>

          <SimpleAnimation type="fade" delay={200}>
            <div className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row">
              <LinkCTA to="/services" theme="accent">
                Découvrir nos services
              </LinkCTA>
              <LinkCTA to="/contact" theme="accent">
                Nous contacter
              </LinkCTA>
            </div>
          </SimpleAnimation>
        </div>
      </div>
    </section>
  );
}
