import TextReveal from '@/components/motion/TextReveal';
import EyePattern from '@/components/common/EyePattern';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

function HeroDesktop() {
  return (
    <div className="hidden lg:block">
      <div className="sticky top-0 h-screen overflow-hidden">
        <EyePattern variant="jaune" opacity={0.03} />

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-container-x">
          <TextReveal
            as="h1"
            className="text-heading text-center text-black"
            style={{ fontSize: 'clamp(3rem, 12vw, 14rem)', lineHeight: '0.95' }}
          >
            PASSEZ NOUS VOIR
          </TextReveal>
        </div>
      </div>
    </div>
  );
}

export default function ContactHero() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section id="hero" className="relative w-full bg-accent" data-navbar-theme="dark">
      {!prefersReducedMotion && <HeroDesktop />}

      <div className={prefersReducedMotion ? '' : 'lg:hidden'}>
        <div className="relative flex min-h-[70vh] items-center py-section">
          <EyePattern variant="jaune" opacity={0.03} />
          <div className="relative z-10 mx-auto max-w-container px-container-x">
            <div className="flex flex-col items-center justify-center text-center">
              <TextReveal
                as="h1"
                className="text-heading text-black"
                style={{ fontSize: 'clamp(3rem, 10vw, 5rem)', lineHeight: '0.95' }}
              >
                PASSEZ NOUS VOIR
              </TextReveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
