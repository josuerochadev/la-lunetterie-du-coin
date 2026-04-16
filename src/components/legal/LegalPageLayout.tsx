import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import Layout from '@/components/common/Layout';
import StickySection from '@/components/common/StickySection';
import EyePattern from '@/components/common/EyePattern';
import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import TextReveal from '@/components/motion/TextReveal';
import { Seo } from '@/seo/Seo';
import LogoNoir from '@/assets/logo/Logo_LLDC_NO_Noir.svg?react';

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
        {/* Hero — compact, fond noir / print: fond blanc, texte noir */}
        <StickySection zIndex={11} enableSticky>
          <section
            className="relative flex min-h-[50vh] w-full items-end bg-black pb-section pt-32 print:min-h-0 print:items-start print:bg-white print:pb-6 print:pt-0"
            data-navbar-theme="light"
          >
            <EyePattern variant="blanc" opacity={0.03} />

            <div className="relative z-10 mx-auto w-full max-w-container px-container-x">
              {/* Logo — print only */}
              <LogoNoir
                className="mb-6 hidden h-auto w-32 print:block"
                aria-label="La Lunetterie du Coin"
              />

              <SimpleAnimation type="fade" delay={0}>
                <Link
                  to="/"
                  className="mb-10 inline-flex items-center gap-2 text-body-sm font-medium uppercase tracking-widest text-white transition-colors hover:text-secondary-orange print:hidden"
                  aria-label="Revenir à la page d'accueil"
                >
                  ← Accueil
                </Link>
              </SimpleAnimation>

              <TextReveal
                as="h1"
                className="text-heading text-accent print:!text-[2rem] print:!text-black"
                style={{ fontSize: 'clamp(2rem, 6vw, 6rem)', lineHeight: '0.95' }}
              >
                {title.toUpperCase()}
              </TextReveal>

              {lastUpdated && (
                <SimpleAnimation type="fade" delay={150}>
                  <p className="mt-6 text-body-sm font-medium uppercase tracking-widest text-white print:text-black">
                    Mise à jour : {lastUpdated}
                  </p>
                </SimpleAnimation>
              )}

              {/* Print separator */}
              <hr className="mt-6 hidden border-black/20 print:block" />
            </div>
          </section>
        </StickySection>

        {/* Content — fond blanc */}
        <StickySection zIndex={12}>
          <section className="relative bg-background" data-navbar-theme="dark">
            <EyePattern variant="blanc" opacity={0.03} />

            <div className="relative z-10 mx-auto max-w-container px-container-x pb-[max(30svh,26vw)] pt-section print:pb-0 print:pt-8">
              <article className="legal-content mx-auto max-w-content-readable space-y-16 print:space-y-8 print:[&>*>section]:break-inside-avoid">
                {children}
              </article>
            </div>
          </section>
        </StickySection>
      </Layout>
    </>
  );
}
