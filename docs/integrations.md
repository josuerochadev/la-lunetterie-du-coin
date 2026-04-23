# Intégrations & Services Externes

Documentation des services tiers consommés par l'application.

## Formspree — Formulaire de contact

- **Endpoint** : configuré dans `src/config/endpoints.ts` (`FORMSPREE_ENDPOINT`)
- **Méthode** : `POST` avec `Content-Type: application/json`
- **Champs envoyés** : `name`, `email`, `message`, `_subject` (sujet auto-généré)
- **Protection anti-spam** : champ honeypot `_gotcha` (voir `src/lib/formSubmissionHelpers.ts`)
- **Retry** : 3 tentatives avec backoff exponentiel (voir `src/lib/retryLogic.ts`)
- **Timeout** : 10 secondes (configurable via `TIMING.formTimeout` dans `src/config/design.ts`)

### Réponses attendues

| Status | Signification         | Comportement client                          |
| ------ | --------------------- | -------------------------------------------- |
| 200    | Succès                | Message de confirmation, reset du formulaire |
| 422    | Erreurs de validation | Affichage des erreurs par champ              |
| 429    | Rate limit            | Message d'erreur, retry automatique          |
| 5xx    | Erreur serveur        | Message d'erreur réseau, retry automatique   |

### Fichiers concernés

- `src/hooks/useFormSubmission.ts` — orchestration de la soumission
- `src/hooks/useFormStatus.ts` — gestion de l'état UI
- `src/hooks/useFormValidation.ts` — validation native HTML
- `src/lib/formSubmissionHelpers.ts` — helpers (honeypot, requête, parsing réponse)
- `src/lib/retryLogic.ts` — logique de retry avec backoff
- `src/lib/networkErrors.ts` — classification des erreurs réseau

---

## Calendly — Prise de rendez-vous

- **URL** : configurée dans `src/config/endpoints.ts` (`BOOKING_URL`)
- **Usage** : lien externe, pas d'intégration API
- **Comportement** : ouvre Calendly dans un nouvel onglet

---

## Sentry — Monitoring d'erreurs

- **Config** : `VITE_SENTRY_DSN` (variable d'environnement, optionnelle)
- **Init** : lazy-loaded après 1 seconde (voir `TIMING.sentryInit` dans `src/config/design.ts`)
- **Intégration** : `@sentry/react` avec `ErrorBoundary` wrapping l'app
- **Environnement dev** : Sentry est désactivé si `VITE_SENTRY_DSN` est absent

### Fichiers concernés

- `src/components/common/ErrorBoundary.tsx` — capture des erreurs React
- `src/lib/env.ts` — validation des variables Sentry

---

## Plausible / GA4 — Analytics

- **Config** : `VITE_ANALYTICS_DOMAIN` (Plausible) ou `VITE_GA4_MEASUREMENT_ID` (GA4)
- **Recommandation** : Plausible (léger, respectueux de la vie privée)
- **Init** : `src/lib/analytics.ts` — skip en dev, init en production
- **Events** : `trackEvent(name, props)` pour les événements custom
- **Environnement dev** : analytics désactivées automatiquement

### Fichiers concernés

- `src/lib/analytics.ts` — init et tracking
