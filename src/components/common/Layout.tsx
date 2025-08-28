import type React from 'react';

import Navbar from '../navbar/Navbar';
import Footer from '../../sections/Footer';

import SkipLink from '@/components/common/SkipLink';

type LayoutProps = {
  children: React.ReactNode;
};

/**
 * Layout global :
 * - Monte le fond décoratif en z-0 derrière tout.
 * - Contenu et navigations en z-base et plus.
 * - A11y : SkipLink + <main id="main" tabIndex={-1}> focusable.
 */
export default function Layout({ children }: LayoutProps) {
  return (
    <div className="relative min-h-screen text-primary">
      {/* Contenu simplifié - plus de Background animé */}
      <div className="relative z-base">
        <SkipLink />
        <Navbar />
        <main id="main" tabIndex={-1} className="min-h-screen">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
