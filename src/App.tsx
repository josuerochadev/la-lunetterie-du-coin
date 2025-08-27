// src/App.tsx
import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';

const MentionsLegales = lazy(() => import('./pages/MentionsLegales'));
const ConditionsDeVente = lazy(() => import('./pages/ConditionsDeVente'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/mentions-legales"
        element={
          <Suspense fallback={<div className="p-4 text-body">…</div>}>
            <MentionsLegales />
          </Suspense>
        }
      />
      <Route
        path="/conditions-de-vente"
        element={
          <Suspense fallback={<div className="p-4 text-body">…</div>}>
            <ConditionsDeVente />
          </Suspense>
        }
      />
      <Route
        path="*"
        element={
          <Suspense fallback={<div className="p-4 text-body">…</div>}>
            <NotFound />
          </Suspense>
        }
      />
    </Routes>
  );
}
