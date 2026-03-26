import type { ReactNode } from 'react';
import { m } from 'framer-motion';

import Layout from '@/components/common/Layout';
import StickySection from '@/components/common/StickySection';
import EyePattern from '@/components/common/EyePattern';
import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { Seo } from '@/seo/Seo';

const SPRING_TRANSITION = { type: 'spring' as const, stiffness: 80, damping: 30, mass: 0.5 };

type LegalPageLayoutProps = {
  title: string;
  seoDescription: string;
  canonicalPath: string;
  children: ReactNode;
  lastUpdated?: string;
};

function HeroDesktop({ title, lastUpdated }: { title: string; lastUpdated?: string }) {
  return (
    <div className="hidden lg:block">
      <div className="sticky top-0 h-screen overflow-hidden">
        <EyePattern variant="blanc" opacity={0.03} />

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-container-x">
          <m.h1
            className="text-heading text-center text-accent"
            style={{ fontSize: 'clamp(3rem, 10vw, 10rem)', lineHeight: '0.95' }}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_TRANSITION, delay: 0.1 }}
          >
            {title.toUpperCase()}
          </m.h1>

          {lastUpdated && (
            <m.p
              className="mt-6 text-body-sm font-medium uppercase tracking-widest text-white/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Dernière mise à jour : {lastUpdated}
            </m.p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LegalPageLayout({
  title,
  seoDescription,
  canonicalPath,
  children,
  lastUpdated,
}: LegalPageLayoutProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <>
      <Seo title={title} description={seoDescription} canonicalPath={canonicalPath} />
      <Layout>
        {/* Hero — fond noir, titre accent */}
        <StickySection zIndex={11} enableSticky>
          <section className="relative w-full bg-black" data-navbar-theme="light">
            {!prefersReducedMotion && <HeroDesktop title={title} lastUpdated={lastUpdated} />}

            <div className={prefersReducedMotion ? '' : 'lg:hidden'}>
              <div className="relative flex min-h-[50vh] items-center py-section">
                <EyePattern variant="blanc" opacity={0.03} />
                <div className="relative z-10 mx-auto max-w-container px-container-x">
                  <div className="flex flex-col items-center justify-center text-center">
                    <SimpleAnimation type="slide-up" delay={0}>
                      <h1
                        className="text-heading text-accent"
                        style={{ fontSize: 'clamp(2rem, 8vw, 4rem)', lineHeight: '0.95' }}
                      >
                        {title.toUpperCase()}
                      </h1>
                    </SimpleAnimation>

                    {lastUpdated && (
                      <SimpleAnimation type="fade" delay={150}>
                        <p className="mt-4 text-body-sm font-medium uppercase tracking-widest text-white/30">
                          Dernière mise à jour : {lastUpdated}
                        </p>
                      </SimpleAnimation>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </StickySection>

        {/* Content — fond blanc, convex curve, EyePattern */}
        <StickySection zIndex={12}>
          <section className="relative bg-background" data-navbar-theme="dark">
            {/* Convex curve transition */}
            <div
              className="pointer-events-none absolute -top-[11vw] left-1/2 z-20 h-[45vw] w-[140vw] -translate-x-1/2 rounded-[50%] bg-background"
              data-navbar-theme="dark"
              aria-hidden="true"
            />

            <EyePattern variant="blanc" opacity={0.03} />

            <div className="relative z-10 mx-auto max-w-container px-container-x py-section">
              <article className="mx-auto max-w-content-readable space-y-16">{children}</article>
            </div>
          </section>
        </StickySection>
      </Layout>
    </>
  );
}
