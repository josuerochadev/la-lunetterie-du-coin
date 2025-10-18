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
          <div className="mx-auto max-w-container px-container-x">
            <div className="mx-auto max-w-5xl">
              <SimpleAnimation type="slide-up" delay={0}>
                <div className="space-y-6">
                  <h1 className="heading-page">{title}</h1>
                  {lastUpdated && (
                    <p className="text-body-sm text-stone">Dernière mise à jour : {lastUpdated}</p>
                  )}
                </div>
              </SimpleAnimation>
            </div>
          </div>
        </SectionContainer>

        {/* Content */}
        <SectionContainer className="bg-background py-section">
          <div className="mx-auto max-w-container px-container-x">
            <article className="mx-auto max-w-content-readable space-y-16">{children}</article>
          </div>
        </SectionContainer>
      </Layout>
    </>
  );
}
