import { useRef } from 'react';
import { m, useScroll } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import ContactForm from '@/components/contact/ContactForm';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useIsLg } from '@/hooks/useIsLg';
import { useScrollEntrance } from '@/hooks/useScrollEntrance';

// ---------------------------------------------------------------------------
// Desktop — scroll-driven entrance
// ---------------------------------------------------------------------------

function FormDesktop() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end end'],
  });

  const title = useScrollEntrance(scrollYProgress, 0.05, 0.22);
  const sub = useScrollEntrance(scrollYProgress, 0.1, 0.28, 30);
  const form = useScrollEntrance(scrollYProgress, 0.15, 0.35);

  return (
    <div ref={sectionRef} className="hidden lg:block">
      <div className="mx-auto max-w-container px-container-x py-section">
        <div className="mx-auto max-w-3xl">
          <m.div style={{ opacity: title.opacity, y: title.y }}>
            <h2 className="heading-section mb-4 text-center">Un mot à nous dire ?</h2>
          </m.div>

          <m.p
            className="mx-auto mb-12 max-w-lg text-center text-body-lg text-black/60"
            style={{ opacity: sub.opacity, y: sub.y }}
          >
            Question, remarque ou juste envie de dire bonjour — on lit tout.
          </m.p>

          <m.div style={{ opacity: form.opacity, y: form.y }}>
            <ContactForm />
          </m.div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export default function ContactFormSection() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isLg = useIsLg();

  return (
    <section id="formulaire" className="relative bg-background" data-navbar-theme="dark">
      {/* Desktop — scroll-driven */}
      {!prefersReducedMotion && isLg && <FormDesktop />}

      {/* Mobile / reduced-motion fallback */}
      <div className={!prefersReducedMotion && isLg ? 'hidden' : ''}>
        <div className="mx-auto max-w-container px-container-x py-section">
          <div className="mx-auto max-w-3xl">
            <SimpleAnimation type="slide-up" delay={0}>
              <h2 className="heading-section mb-4 text-center">Un mot à nous dire ?</h2>
            </SimpleAnimation>

            <SimpleAnimation type="slide-up" delay={50}>
              <p className="mx-auto mb-10 max-w-lg text-center text-body-lg text-black/60">
                Question, remarque ou juste envie de dire bonjour — on lit tout.
              </p>
            </SimpleAnimation>

            <SimpleAnimation type="fade" delay={100}>
              <ContactForm />
            </SimpleAnimation>
          </div>
        </div>
      </div>
    </section>
  );
}
