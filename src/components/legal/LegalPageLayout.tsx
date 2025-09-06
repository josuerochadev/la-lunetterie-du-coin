import type { ReactNode } from 'react';

import Layout from '@/components/common/Layout';
import SectionContainer from '@/components/common/SectionContainer';
import PageHeader from '@/components/legal/PageHeader';
import { OptimizedAnimateItem } from '@/components/motion/OptimizedAnimateItem';
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
      <div className="relative z-base">
        <Layout>
          <SectionContainer className="pb-section pt-36">
            <OptimizedAnimateItem index={0} type="fade-down" immediate={true}>
              <PageHeader title={title} />
            </OptimizedAnimateItem>
            <article className="mx-auto max-w-4xl space-y-16 px-8 text-body leading-relaxed">
              {lastUpdated && (
                <OptimizedAnimateItem index={1} type="fade-up" threshold={0.4}>
                  <div className="border-dark-green mb-2 border-l-4 py-2 pl-6">
                    <p className="text-body-sm text-primary">
                      <span className="font-semibold">Dernière mise à jour :</span> {lastUpdated}
                    </p>
                  </div>
                </OptimizedAnimateItem>
              )}
              {children}
            </article>
          </SectionContainer>
        </Layout>
      </div>
    </>
  );
}
