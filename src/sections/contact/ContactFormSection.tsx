import { m } from 'framer-motion';

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
    <div ref={ref} className="hidden xl:block">
      <div className="mx-auto max-w-container px-container-x pb-section pt-[max(12vh,6rem)]">
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
// Mobile — natural flow with IntersectionObserver-based reveal
//
// A form cannot be pinned in a sticky scrollytelling — users need to scroll
// freely while editing fields. We use SimpleAnimation (IO-based) so each
// block fades in as it crosses into the viewport, matching the static flow.
// ---------------------------------------------------------------------------

function FormMobile() {
  return (
    <div className="xl:hidden">
      <div className="mx-auto max-w-container px-container-x pb-section pt-[max(10vh,5rem)]">
        <div className="mx-auto max-w-3xl">
          <SimpleAnimation type="slide-up" delay={0}>
            <h2 className="heading-section mb-4 text-center">Un mot à nous dire ?</h2>
          </SimpleAnimation>

          <SimpleAnimation type="slide-up" delay={80}>
            <p className="mx-auto mb-10 max-w-lg text-center text-body-lg text-black">
              Question, remarque ou juste envie de dire bonjour — on lit tout.
            </p>
          </SimpleAnimation>

          <SimpleAnimation type="slide-up" delay={160}>
            <ContactForm />
          </SimpleAnimation>
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
      {(variant === 'mobile-animated' || variant === 'static') && <FormMobile />}
    </section>
  );
}
