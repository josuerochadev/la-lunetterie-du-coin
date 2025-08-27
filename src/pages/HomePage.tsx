import { Suspense, lazy } from 'react';

import Layout from '@/components/common/Layout';
import Hero from '@/sections/Hero';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { Seo } from '@/seo/Seo';
import { LocalBusinessJsonLd } from '@/seo/LocalBusinessJsonLd';

// Lazy load below-the-fold sections for better LCP
const Offers = lazy(() => import('@/sections/Offers'));
const Services = lazy(() => import('@/sections/Services'));
const Concept = lazy(() => import('@/sections/Concept'));
const Contact = lazy(() => import('@/sections/Contact'));
const FloatingCTA = lazy(() => import('@/components/common/FloatingCTA'));

export default function HomePage() {
  useSmoothScroll();
  return (
    <>
      <Seo
        title="La Lunetterie du Coin - Opticien à Strasbourg"
        description="Montures neuves & d'occasion, conseils personnalisés, ajustage et services atelier à Strasbourg."
        canonicalPath="/"
      />
      <LocalBusinessJsonLd />
      <div className="relative z-base">
        <Layout>
          {/* Above-the-fold - Load immediately */}
          <Hero />
          
          {/* Below-the-fold - Lazy load for better LCP */}
          <Suspense fallback={<div className="h-[400px] loading-skeleton" />}>
            <Offers />
          </Suspense>
          
          <Suspense fallback={<div className="h-[500px] loading-skeleton" />}>
            <Services />
          </Suspense>
          
          <Suspense fallback={<div className="h-[400px] loading-skeleton" />}>
            <Concept />
          </Suspense>
          
          <Suspense fallback={<div className="h-[600px] loading-skeleton" />}>
            <Contact />
          </Suspense>
          
          <Suspense fallback={null}>
            <FloatingCTA />
          </Suspense>
        </Layout>
      </div>
    </>
  );
}
