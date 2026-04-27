// src/App.tsx
import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from '@/pages/HomePage';
import ComingSoon from '@/pages/ComingSoon';
import { withSuspense } from '@/components/common/withSuspense';

// Lazy-loaded pages avec Suspense HOC
const AboutPage = withSuspense(lazy(() => import('@/pages/AboutPage')));
const ServicesPage = withSuspense(lazy(() => import('@/pages/ServicesPage')));
const OffersPage = withSuspense(lazy(() => import('@/pages/OffersPage')));
const ContactPage = withSuspense(lazy(() => import('@/pages/ContactPage')));
const MentionsLegales = withSuspense(lazy(() => import('@/pages/MentionsLegales')));
const ConditionsDeVente = withSuspense(lazy(() => import('@/pages/ConditionsDeVente')));
const NotFound = withSuspense(lazy(() => import('@/pages/NotFound')));

const isSiteLive = import.meta.env.VITE_SITE_LIVE === 'true';

export default function App() {
  if (!isSiteLive) {
    return <ComingSoon />;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/a-propos" element={<AboutPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/offres" element={<OffersPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/mentions-legales" element={<MentionsLegales />} />
      <Route path="/conditions-de-vente" element={<ConditionsDeVente />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
