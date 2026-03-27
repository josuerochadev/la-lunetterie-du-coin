import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import Layout from '@/components/common/Layout';
import StickySection from '@/components/common/StickySection';
import EyePattern from '@/components/common/EyePattern';
import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import TextReveal from '@/components/motion/TextReveal';
import { Seo } from '@/seo/Seo';

type LegalPageLayoutProps = {
  title: string;
  seoDescription: string;
  canonicalPath: string;
  children: ReactNode;
  lastUpdated?: string;
};

export default function LegalPageLayout({
  title,
  seoDescription,
  canonicalPath,
  children,
  lastUpdated,
}: LegalPageLayoutProps) {
  return (
    <>
      <Seo title={title} description={seoDescription} canonicalPath={canonicalPath} />
      <Layout>
        {/* Hero — compact, fond noir */}
        <StickySection zIndex={11} enableSticky>
          <section
            className="relative flex min-h-[40vh] w-full items-end bg-black pb-section"
            data-navbar-theme="light"
          >
            <EyePattern variant="blanc" opacity={0.03} />

            <div className="relative z-10 mx-auto w-full max-w-container px-container-x">
              <SimpleAnimation type="fade" delay={0}>
                <Link
                  to="/"
                  className="mb-8 inline-flex items-center gap-2 text-body-sm font-medium uppercase tracking-widest text-white/40 transition-colors hover:text-white/70"
                  aria-label="Revenir à la page d'accueil"
                >
                  ← Accueil
                </Link>
              </SimpleAnimation>

              <TextReveal
                as="h1"
                className="text-heading text-accent"
                style={{ fontSize: 'clamp(2rem, 6vw, 6rem)', lineHeight: '0.95' }}
              >
                {title.toUpperCase()}
              </TextReveal>

              {lastUpdated && (
                <SimpleAnimation type="fade" delay={150}>
                  <p className="mt-4 text-body-sm font-medium uppercase tracking-widest text-white/30">
                    Mise à jour : {lastUpdated}
                  </p>
                </SimpleAnimation>
              )}
            </div>
          </section>
        </StickySection>

        {/* Content — fond blanc, convex curve */}
        <StickySection zIndex={12}>
          <section className="relative bg-background" data-navbar-theme="dark">
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
