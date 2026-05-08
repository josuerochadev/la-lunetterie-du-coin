# Audit Qualite -- Plan de remediation

> **But** : remonter la note qualite de 7,5/10 → 9/10 via des PR ciblees, une session = une PR.
> **Source** : audit qualite realisee le 2026-04-16 sur la branche `chore/final-audit`.
> **Mode operatoire** : voir [Rituel de session](#rituel-de-session) en bas.

---

## Etat courant

- **Phase active** : Phase 6 — Opportuniste (en cours)
- **Branche** : `fix/audit-phase6-keys`
- **Derniere session** : 2026-05-08 (Phase 6 — remplacement `key={i}` par cles stables)

---

## Garde-fous transverses

- Une PR = un theme. Pas de PR fourre-tout.
- Jamais de decoupage de composant >300 lignes sans tests prealables (filet Phase 4).
- Conventional commits (deja la norme du repo).
- Validation visuelle manuelle sur les 3 breakpoints (mobile/tablet/desktop) avant chaque merge.
- Pre-commit hooks stricts : ne JAMAIS bypasser avec `--no-verify`.

---

## Phase 1 — Quick wins (1 PR, ~1h, risque nul)

**Branche** : `chore/cleanup-quick-wins`

- [x] Activer regle `no-console` dans `eslint.config.js` (error, exceptions warn/error possibles)
- [x] Nettoyer `console.*` non gardes
- [x] Corriger imports relatifs dans `src/App.tsx:5-7` + `src/main.tsx:9-10` → alias `@/`
- [x] Verifier usage de `src/components/debug/SentryTest.tsx` → supprime (non utilise en prod)
- [x] `.gitignore` : deja a jour

---

## Phase 2 — Hygiene typage (2 PR, ~3h, risque nul)

### Phase 2a — `any` dans tests

**Branche** : `chore/typing-tests-any`

- [x] `src/seo/__tests__/Seo.test.tsx` (47 occurrences) — helper type `src/seo/test-utils/helmet-helpers.ts`
- [x] `src/seo/__tests__/LocalBusinessJsonLd.test.tsx` (4 occurrences) — interfaces JSON-LD typees
- [x] `src/components/contact/__tests__/ContactForm.test.tsx` — interfaces MockFormFieldProps etc.
- [x] `src/components/legal/__tests__/*` — types inline sur mocks
- [x] `src/hooks/__tests__/useIntersectionObserver.test.ts` — MockIntersectionObserver type
- [x] `src/components/motion/__tests__/SimpleAnimation.test.tsx` — MockIntersectionObserver type

### Phase 2b — `eslint-disable no-unused-vars`

**Branche** : `chore/typing-eslint-disable`

- [x] `src/lib/{analytics.ts, toastContext.ts, retryLogic.ts}` — supprime eslint-disable
- [x] `src/components/contact/FormField.tsx` — supprime eslint-disable
- [x] `src/components/services/ServiceThumbnail.tsx`, `src/components/offers/OfferCard.tsx` — supprime eslint-disable
- [x] `src/hooks/{useFormStatus.ts, useFormValidation.ts, useFormSubmission.ts}` — supprime eslint-disable
- [x] `src/components/motion/GiantCounter.tsx` — supprime eslint-disable
- [x] Desactive `no-unused-vars` base au profit de `@typescript-eslint/no-unused-vars`

---

## Phase 3 — Magic numbers (3 PR, ~3h, risque faible)

### Phase 3a — Offers

**Branche** : `refactor/offers-timeline-constants`

- [x] Extraire `OFFERS_TIMELINE`, `STAGGER_OFFSET`, `SLICE`, `ENTER_OFFSET`, `TEXT_*` de `src/sections/offers/OffersContent.tsx:21-38, 61, 336, 339-349`

### Phase 3b — Services Mobile

**Branche** : `refactor/services-mobile-timeline-constants`

- [x] Extraire `TOTAL_VH`, phases de `src/sections/home/services/ServicesMobileAnimated.tsx:21-33`

### Phase 3c — Petites sections (groupees)

**Branche** : `refactor/misc-magic-numbers`

- [x] `src/components/navbar/Navbar.tsx:23` — `HOVER_ZONE_HEIGHT` → `HOVER_ZONE_HEIGHT_PX`
- [x] `src/components/common/Toast.tsx:16` — `TOAST_DURATION` → `TOAST_DURATION_MS`
- [x] `src/sections/home/story/StoryDesktopAnimated.tsx:76` — phases inline → `StoryDesktopAnimated.timeline.ts`

---

## Phase 4 — Tests filet sur sections critiques (1 PR par section, ~1h chacune)

**Avant** tout decoupage Phase 5. Tests comportementaux minimaux : rendu sans crash, CTA presents, variants responsive.

- [x] FullScreenMenu — 10 tests (nav links, CTA, close, store info)
- [x] ContactLocation — 8 tests (transports, accessibilite, Maps CTA)
- [x] AboutEngagement — 8 tests (titre, stats, body, highlight)
- [x] AboutHistory — 9 tests (titre, body, CTA services, photo)
- [x] ServicesMobileAnimated — 8 tests (slides, outro, progress bar)
- [x] OffersContent — 9 tests (catchphrases, counters, CTAs, conditions)

**Branche unique** : `test/coverage-phase4` (52 tests total)

---

## Phase 5 — Decoupage composants monstres (1 session = 1 section)

**Regle stricte** : ne pas demarrer une section sans la PR Phase 4 correspondante mergee.

- [x] **5.1** `src/components/navbar/FullScreenMenu.tsx` (370l) → `<MobileMenuLayout>` + `<DesktopMenuLayout>`
- [x] **5.2** `src/sections/contact/ContactLocation.tsx` (478l) → deja splitee : `<MapBlock>` (149l), `<DirectionsBlock>` (264l), parent (93l)
- [x] **5.3** `src/sections/about/AboutEngagement.tsx` (368l) → extraire etats timeline
- [x] **5.4** `src/sections/about/AboutHistory.tsx` (590l) → split en HistoryDesktop + HistoryMobile + HistoryStatic
- [x] **5.5** `src/sections/home/services/ServicesMobileAnimated.tsx` (538l) → `<ServiceSlide>` + deplacer phases
- [x] **5.6** `src/sections/offers/OffersContent.tsx` (750l) → split en OffersDesktop + OffersMobile + OffersStatic

---

## Phase 6 — Opportuniste (au fil de l'eau)

Pas de PR dediee — a faire quand on touche le fichier de toute facon :

- [x] Remplacer `key={i}` par cles stables (19 occurrences sur 15 fichiers)
- [ ] Refactor logique formulaire (4 fichiers → 2) le jour ou on retouche le formulaire
- [ ] Ameliorer ErrorBoundary quand un cas d'erreur reel se presente

---

## Rituel de session

**Debut** :

1. Tu dis : _"on reprend l'audit"_ (ou _"audit, S<phase>"_)
2. Je lis ce fichier + `git status` + `git log -5`
3. Je confirme la phase/branche/objectif en 2-3 lignes

**Pendant** :

- Une seule branche par session
- TaskList interne pour les sessions a plusieurs etapes
- Si la session devient longue, couper proprement (draft PR avec TODO en haut)

**Fin** :

1. Commit + push de la branche
2. Mise a jour de ce fichier (cases cochees + bloc "Etat courant" en haut)
3. Si phase finie : ouverture PR

---

## Journal des sessions

| Date       | Phase | Branche                                       | PR  | Notes                                                                                   |
| ---------- | ----- | --------------------------------------------- | --- | --------------------------------------------------------------------------------------- |
| 2026-04-16 | —     | —                                             | —   | Plan cree                                                                               |
| 2026-04-21 | 1     | `chore/cleanup-quick-wins`                    | —   | Quick wins : no-console ESLint, console.log→warn, imports @/, suppression SentryTest    |
| 2026-04-21 | 2a    | `chore/typing-tests-any`                      | —   | Suppression de tous les `any` dans 9 fichiers de tests, helper type Helmet cree         |
| 2026-04-21 | 2b    | `chore/typing-eslint-disable`                 | —   | Suppression 17 eslint-disable no-unused-vars, desactivation regle base JS               |
| 2026-04-21 | 3a    | `refactor/offers-timeline-constants`          | —   | Extraction constantes timeline OffersContent → fichier dedie                            |
| 2026-04-21 | 3b    | `refactor/services-mobile-timeline-constants` | —   | Extraction constantes timeline ServicesMobileAnimated → fichier dedie                   |
| 2026-04-21 | 3c    | `refactor/misc-magic-numbers`                 | —   | HOVER_ZONE_HEIGHT_PX, TOAST_DURATION_MS, StoryDesktopAnimated.timeline.ts               |
| 2026-04-21 | 4     | `test/coverage-phase4`                        | —   | 52 tests filet sur 6 sections critiques (1 branche, 1 PR)                               |
| 2026-04-22 | 5.6   | `refactor/split-offers-content`               | —   | OffersContent (730l) → OffersDesktop + OffersMobile + OffersStatic + parent slim        |
| 2026-04-22 | 5.2   | `chore/audit-tracker-5.2-done`                | —   | ContactLocation deja splitee (93l + MapBlock 149l + DirectionsBlock 264l) — case cochee |
| 2026-05-08 | 6     | `fix/audit-phase6-keys`                       | —   | Remplacement key={i} par cles stables + resolution conflits merge audit tracker         |
