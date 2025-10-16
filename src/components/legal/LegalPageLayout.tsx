import type { ReactNode } from 'react';

import Layout from '@/components/common/Layout';
import SectionContainer from '@/components/common/SectionContainer';
import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import { Seo } from '@/seo/Seo';

type LegalPageLayoutProps = {
  title: string;
  seoDescription: string;
  canonicalPath: string;
  children: ReactNode;
  lastUpdated?: string;
};

/**
 * Layout réutilisable pour les pages légales (Mentions légales, CGV, etc.)
 *
 * Centralise la structure commune des pages légales avec :
 * - SEO optimisé
 * - Header avec navigation de retour
 * - Structure d'article accessible
 * - Date de mise à jour optionnelle
 *
 * @component
 * @param {LegalPageLayoutProps} props - Les propriétés du composant
 * @returns {JSX.Element} Layout complet pour page légale
 */
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
        {/* Hero */}
        <SectionContainer className="bg-background py-section">
          <div className="mx-auto max-w-container px-4 sm:px-6">
            <div className="mx-auto max-w-4xl text-center">
              <SimpleAnimation type="slide-up" delay={0}>
                <h1 className="mb-6 text-title-lg font-medium text-text">{title}</h1>
              </SimpleAnimation>

              {lastUpdated && (
                <SimpleAnimation type="slide-up" delay={100}>
                  <p className="text-body-sm text-stone">Dernière mise à jour : {lastUpdated}</p>
                </SimpleAnimation>
              )}
            </div>
          </div>
        </SectionContainer>

        {/* Content */}
        <SectionContainer className="bg-background py-section">
          <div className="mx-auto max-w-container px-4 sm:px-6">
            <article className="mx-auto max-w-4xl space-y-16">{children}</article>
          </div>
        </SectionContainer>
      </Layout>
    </>
  );
}
