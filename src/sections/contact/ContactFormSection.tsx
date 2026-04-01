import { useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import ContactForm from '@/components/contact/ContactForm';
import { useScrollEntrance } from '@/hooks/useScrollEntrance';
import { useManualScrollProgress } from '@/hooks/useManualScrollProgress';
import { useResponsiveMotion } from '@/hooks/useResponsiveMotion';

// ---------------------------------------------------------------------------
// Desktop — scroll-driven entrance
// ---------------------------------------------------------------------------

function FormDesktop() {
  const { ref, scrollYProgress } = useManualScrollProgress('start-end');

  const title = useScrollEntrance(scrollYProgress, 0.05, 0.22);
  const sub = useScrollEntrance(scrollYProgress, 0.1, 0.28, 30);
  const form = useScrollEntrance(scrollYProgress, 0.15, 0.35);

  return (
    <div ref={ref} className="hidden lg:block">
      <div className="mx-auto max-w-container px-container-x py-section">
        <div className="mx-auto max-w-3xl">
          <m.div style={{ opacity: title.opacity, y: title.y }}>
            <h2 className="heading-section mb-4 text-center">Un mot à nous dire ?</h2>
          </m.div>

          <m.p
            className="mx-auto mb-12 max-w-lg text-center text-body-lg text-black"
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
// Mobile — scroll-driven entrance
// ---------------------------------------------------------------------------

function FormMobileAnimated() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const titleOpacity = useTransform(scrollYProgress, [0.0, 0.15], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.0, 0.15], [25, 0]);

  const subOpacity = useTransform(scrollYProgress, [0.05, 0.2], [0, 1]);
  const subY = useTransform(scrollYProgress, [0.05, 0.2], [20, 0]);

  const formOpacity = useTransform(scrollYProgress, [0.1, 0.25], [0, 1]);
  const formScale = useTransform(scrollYProgress, [0.1, 0.25], [0.98, 1]);

  return (
    <div ref={ref} className="lg:hidden">
      <div className="mx-auto max-w-container px-container-x py-section">
        <div className="mx-auto max-w-3xl">
          <m.div style={{ opacity: titleOpacity, y: titleY }} className="will-change-transform">
            <h2 className="heading-section mb-4 text-center">Un mot à nous dire ?</h2>
          </m.div>

          <m.p
            className="mx-auto mb-10 max-w-lg text-center text-body-lg text-black will-change-transform"
            style={{ opacity: subOpacity, y: subY }}
          >
            Question, remarque ou juste envie de dire bonjour — on lit tout.
          </m.p>

          <m.div
            style={{ opacity: formOpacity, scale: formScale }}
            className="will-change-transform"
          >
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
  const variant = useResponsiveMotion();

  return (
    <section id="formulaire" className="relative bg-background" data-navbar-theme="dark">
      {variant === 'desktop-animated' && <FormDesktop />}
      {variant === 'mobile-animated' && <FormMobileAnimated />}
      {variant === 'static' && (
        <div>
          <div className="mx-auto max-w-container px-container-x py-section">
            <div className="mx-auto max-w-3xl">
              <SimpleAnimation type="slide-up" delay={0}>
                <h2 className="heading-section mb-4 text-center">Un mot à nous dire ?</h2>
              </SimpleAnimation>

              <SimpleAnimation type="slide-up" delay={50}>
                <p className="mx-auto mb-10 max-w-lg text-center text-body-lg text-black">
                  Question, remarque ou juste envie de dire bonjour — on lit tout.
                </p>
              </SimpleAnimation>

              <SimpleAnimation type="fade" delay={100}>
                <ContactForm />
              </SimpleAnimation>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
