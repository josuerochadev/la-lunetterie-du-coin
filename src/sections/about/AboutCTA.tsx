import { m, useScroll, useTransform } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import LinkCTA from '@/components/common/LinkCTA';

/**
 * Section CTA finale — version légère pour pages secondaires.
 * Pas de zoom scroll-driven, juste des entrées staggerées au viewport.
 */
export default function AboutCTA() {
  const { scrollYProgress } = useScroll();
  const motifScale = useTransform(scrollYProgress, [0.85, 1], [1, 1.4]);

  return (
    <section
      className="relative flex min-h-screen w-full items-center overflow-hidden bg-accent"
      data-navbar-theme="dark"
    >
      {/* Eye motif — circle frame around content, zoom on scroll */}
      <m.img
        src="/images/motif-cercle.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-multiply"
        style={{ scale: motifScale }}
      />

      <div className="relative z-10 mx-auto max-w-container px-container-x py-section">
        <div className="mx-auto max-w-4xl text-center">
          <SimpleAnimation type="slide-up" delay={0}>
            <h2 className="heading-section text-black">YEUX T&apos;AIMENT</h2>
          </SimpleAnimation>

          <SimpleAnimation type="slide-up" delay={100}>
            <p className="mt-6 text-body-lg text-black/50">Venez voir par vous-même.</p>
          </SimpleAnimation>

          <SimpleAnimation type="fade" delay={200}>
            <div className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row">
              <LinkCTA to="/services" theme="accent">
                Voir nos services
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
