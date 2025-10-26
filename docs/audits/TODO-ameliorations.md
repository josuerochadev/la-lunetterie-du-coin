# 📋 TODO - Améliorations à Implémenter

**Date de création**: 26 octobre 2025
**Statut**: 13 recommandations non implémentées sur 35 analysées
**Score d'implémentation**: 63%

---

## 📊 Résumé Exécutif

Ce document liste toutes les recommandations **NON ENCORE IMPLÉMENTÉES** issues des audits techniques et qualité.

**Recommandations par priorité**:

- 🔴 **Critiques/Hautes**: 5 items (Sécurité + Performance)
- 🟡 **Moyennes**: 4 items (Tests + Monitoring)
- 🟢 **Basses**: 4 items (Polish + Documentation)
- **Optionnelles**: 2 items (KISS/SOLID raffinements)

---

## 🔴 PHASE IMMÉDIATE (Cette semaine) - CRITIQUE

**Temps total**: 1 heure
**Impact**: Correction vulnérabilités sécurité

### S1 - Mettre à Jour Vite (CRITIQUE)

- **Priorité**: 🔴 CRITIQUE
- **Effort**: 30 minutes
- **Source**: `audit-technique-complet.md` lignes 317-336
- **Problème**: CVE Vite 7.1.5 - Vulnérabilité Moderate (Bypass server.fs.deny)
- **Solution**:
  ```bash
  pnpm update vite@latest
  pnpm update vitest@latest
  ```
- **Validation**: `pnpm audit --audit-level=moderate`
- **Statut**: ⚠️ À FAIRE

### S2 - Mettre à Jour Playwright (CRITIQUE)

- **Priorité**: 🔴 CRITIQUE
- **Effort**: 30 minutes
- **Source**: `audit-technique-complet.md` lignes 338-352
- **Problème**: Playwright 1.55.0 - Vulnérabilité High (SSL Certificate Validation)
- **Solution**:
  ```bash
  pnpm update playwright@latest @playwright/test@latest
  ```
- **Validation**: Build + tests doivent passer
- **Statut**: ⚠️ À FAIRE

**Critères de succès Phase Immédiate**:

- [ ] Zéro vulnérabilités >=moderate
- [ ] Build réussit (`pnpm build`)
- [ ] Tous tests passent (`pnpm test:run`)

---

## 🟡 PHASE 1 (2 semaines) - HAUTE PRIORITÉ

**Temps total**: 10-14 heures
**Impact**: Performance bundle + Monitoring + Automation

### P1 - Split React-Vendor Bundle

- **Priorité**: 🔴 HAUTE
- **Effort**: 4-6 heures
- **Source**: `audit-technique-complet.md` lignes 240-270
- **Problème**: `react-vendor-BwvzicDE.js` = 273.88 kB (89.86 kB gzip) - dépasse 250 kB
- **Impact estimé**: -80 kB (bundle gzip)
- **Solution**: Configurer manual chunks dans `vite.config.ts`
  ```typescript
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-core': ['react', 'react-dom'],
          'react-router': ['react-router-dom'],
          'framer': ['framer-motion'],
        }
      }
    }
  }
  ```
- **Statut**: ⚠️ À FAIRE

### P2 - Lazy Load Sentry

- **Priorité**: 🟡 MOYENNE
- **Effort**: 2 heures
- **Source**: `audit-technique-complet.md` lignes 272-280
- **Problème**: `sentry-BqXqpQPI.js` = 125.49 kB (43.13 kB gzip)
- **Impact estimé**: -50 kB (bundle gzip)
- **Solutions**:
  1. Lazy load Sentry en production uniquement
  2. Utiliser `@sentry/browser` au lieu de `@sentry/react`
  3. Tree-shaking des intégrations non utilisées
  ```typescript
  // lib/monitoring.ts
  if (import.meta.env.PROD) {
    const Sentry = await import('@sentry/react');
    // ...
  }
  ```
- **Statut**: ⚠️ À FAIRE

### P5 - Réactiver Lighthouse CI

- **Priorité**: 🔴 HAUTE
- **Effort**: 2-3 heures
- **Source**: `audit-technique-complet.md` lignes 309, 700-702
- **Problème**: Lighthouse CI désactivé (scores null dans PR comments)
- **Impact**: Métriques performance + Quality gates
- **Solution**:
  1. Fixer configuration Lighthouse CI
  2. Réactiver dans workflow GitHub Actions
  3. Intégrer quality gates
- **Statut**: ⚠️ À FAIRE

### S4 - Configurer Dependabot/Renovate

- **Priorité**: 🔴 HAUTE
- **Effort**: 1-2 heures
- **Source**: `audit-technique-complet.md` lignes 419, 704-706
- **Impact**: Prévention futures vulnérabilités
- **Solution**:
  - Créer `.github/dependabot.yml` ou `renovate.json`
  - Schedule: Weekly
  - Auto-merge: patch/minor (avec tests)
- **Statut**: ⚠️ À FAIRE

### P4 - Bundle Analysis avec Visualizer

- **Priorité**: 🟡 MOYENNE
- **Effort**: 1 heure
- **Source**: `audit-technique-complet.md` lignes 296, 709
- **Impact**: Détection opportunités optimisation
- **Solution**:
  ```bash
  pnpm add -D rollup-plugin-visualizer
  ```

  - Intégrer dans CI/CD pour tracking bundle size
- **Statut**: ⚠️ À FAIRE

**Critères de succès Phase 1**:

- [ ] react-vendor < 70 kB gzip
- [ ] Total bundle < 150 kB gzip
- [ ] Lighthouse CI opérationnel avec quality gates
- [ ] Dependabot configuré et actif
- [ ] Bundle visualizer généré dans CI

---

## 🟢 PHASE 2 (1 mois) - MOYENNE PRIORITÉ

**Temps total**: 14-18 heures
**Impact**: Tests + Maintenabilité + Performance finale

### T1 - Augmenter Couverture de Tests

- **Priorité**: 🟡 MOYENNE
- **Effort**: 6-8 heures
- **Source**: `audit-technique-complet.md` lignes 186-201, 809-821
- **Objectif**: Coverage 45% → 55% (+10%)
- **Fichiers prioritaires**:
  1. `ServicesPage.tsx` (161 lignes) - 2h
  2. `OffersPage.tsx` (148 lignes) - 2h
  3. `AboutPage.tsx` (271 lignes) - 2h
  4. Navbar interactions - 1h
  5. `lib/monitoring.ts` (309 lignes) - 1-2h
- **Statut**: ⚠️ À FAIRE

### A1 - Simplification Footer.tsx

- **Priorité**: 🟢 BASSE
- **Effort**: 2-3 heures
- **Source**: `audit-technique-complet.md` lignes 534-558
- **Problème**: Footer.tsx = 272 lignes (objectif <250)
- **Solution**: Refactoriser en sous-composants
  ```tsx
  <Footer>
    <FooterLogo />
    <FooterNavigation />
    <FooterSocial />
    <FooterCopyright />
  </Footer>
  ```
- **Statut**: ⚠️ À FAIRE

### A1b - Simplification ContactPage.tsx

- **Priorité**: 🟢 BASSE
- **Effort**: 2-3 heures
- **Source**: `audit-technique-complet.md` lignes 534-558
- **Problème**: ContactPage.tsx = 313 lignes (objectif <250)
- **Solution**: Extraire sections en composants
  - ContactHero
  - ContactForm (déjà extrait ✅)
  - ContactInfo
  - ContactMap
- **Statut**: 🟡 PARTIELLEMENT FAIT (form extrait)

### P3 - Optimiser Imports Lucide

- **Priorité**: 🟢 BASSE
- **Effort**: 1 heure
- **Source**: `audit-technique-complet.md` ligne 296
- **Impact estimé**: -10 kB
- **Solution**: Vérifier tous imports utilisent chemins spécifiques

  ```typescript
  // ❌ Éviter
  import { Icon } from 'lucide-react';

  // ✅ Préférer
  import Icon from 'lucide-react/dist/esm/icons/icon-name';
  ```

- **Statut**: ⚠️ À FAIRE

### P6 - Atteindre Lighthouse Targets

- **Priorité**: 🟡 MOYENNE
- **Effort**: Variable (dépend de P1-P5)
- **Source**: `audit-technique-complet.md` lignes 299-308
- **Objectifs**:
  - First Contentful Paint: < 1.8s
  - Time to Interactive: < 3.8s
  - Cumulative Layout Shift: < 0.1
  - Overall Performance: ≥ 90
- **Prérequis**: P5 (Lighthouse CI réactivé)
- **Statut**: ⚠️ NON MESURÉ (dépend P5)

**Critères de succès Phase 2**:

- [ ] Coverage ≥ 55%
- [ ] Tous fichiers < 250 lignes
- [ ] Lighthouse scores atteints (FCP, TTI, CLS)
- [ ] Tous imports Lucide optimisés

---

## 🔵 PHASE OPTIONNELLE (Si temps disponible)

**Temps total**: 5-8 heures
**Impact**: Polish + Documentation

### KISS Phase 4 (OPTIONNEL)

- **Priorité**: 🟢 BASSE (Nice-to-have)
- **Effort**: 1.5-2 heures
- **Source**: `audit-kiss-verification-finale.md` lignes 86-328
- **Impact estimé**: Score KISS 9.5 → 9.8/10
- **Actions**:
  1. Créer `src/data/homepage.ts`
  2. Créer `src/data/contact.ts` (opening hours)
  3. Refactoriser `ServicesMinimal.tsx`
  4. Refactoriser `OffersEditorial.tsx`
  5. Refactoriser `ContactPage.tsx` (horaires)
- **Gain**: -64 lignes UI, +95 lignes data
- **Statut**: ⚠️ À FAIRE (optionnel)

### SOLID Raffinements (OPTIONNEL)

- **Priorité**: 🟢 BASSE (Nice-to-have)
- **Effort**: 3-4 heures
- **Source**: `audit-solid-principles.md` lignes 197-249, 587-620, 848-885
- **Impact estimé**: Score SOLID 9.3 → 9.8/10
- **Actions**:
  1. **OCP**: Subject configurable dans `createFormRequest()`
  2. **ISP**: Ségrégation `useFormStatus` en hooks spécialisés
  3. **DIP**: Endpoint injectable dans `useFormSubmission()`
- **Statut**: ⚠️ À FAIRE (optionnel)

### D1 - Documentation ADR (OPTIONNEL)

- **Priorité**: 🟢 BASSE (Nice-to-have)
- **Effort**: Ongoing
- **Source**: `audit-technique-complet.md` lignes 846-850
- **Impact**: Onboarding nouveaux développeurs
- **Actions**:
  1. Documenter architecture decisions (ADR)
  2. Créer guide contribution
  3. Documenter patterns React utilisés
- **Statut**: ⚠️ À FAIRE (optionnel)

---

## 📊 Tableau Récapitulatif

| ID  | Recommandation                | Priorité | Effort | Impact      | Phase      | Statut      |
| --- | ----------------------------- | -------- | ------ | ----------- | ---------- | ----------- |
| S1  | Update Vite                   | 🔴       | 30min  | Sécurité    | Immédiate  | ⚠️ TODO     |
| S2  | Update Playwright             | 🔴       | 30min  | Sécurité    | Immédiate  | ⚠️ TODO     |
| P1  | Split react-vendor            | 🔴       | 4-6h   | -80kB       | Phase 1    | ⚠️ TODO     |
| P5  | Réactiver Lighthouse CI       | 🔴       | 2-3h   | Monitoring  | Phase 1    | ⚠️ TODO     |
| S4  | Dependabot/Renovate           | 🔴       | 1-2h   | Sécurité    | Phase 1    | ⚠️ TODO     |
| P2  | Lazy load Sentry              | 🟡       | 2h     | -50kB       | Phase 1    | ⚠️ TODO     |
| P4  | Bundle Visualizer             | 🟡       | 1h     | Analyse     | Phase 1    | ⚠️ TODO     |
| T1  | Tests coverage 55%            | 🟡       | 6-8h   | Robustesse  | Phase 2    | ⚠️ TODO     |
| S3  | Surveiller tar-fs             | 🟡       | Passif | Sécurité    | Monitoring | ⏳ EN COURS |
| A1  | Simplifier Footer/ContactPage | 🟢       | 4-6h   | Maintenable | Phase 2    | 🟡 PARTIEL  |
| P3  | Optimiser Lucide imports      | 🟢       | 1h     | -10kB       | Phase 2    | ⚠️ TODO     |
| P6  | Lighthouse targets            | 🟡       | Var    | UX          | Phase 2    | ⚠️ TODO     |
| D1  | Documentation ADR             | 🟢       | Ongo   | Onboarding  | Optionnel  | ⚠️ TODO     |
| OPT | KISS Phase 4                  | 🟢       | 2h     | +0.3 KISS   | Optionnel  | ⚠️ TODO     |
| OPT | SOLID Raffinements            | 🟢       | 3-4h   | +0.5 SOLID  | Optionnel  | ⚠️ TODO     |

**Légende**:

- 🔴 HAUTE : Urgent, impact significatif
- 🟡 MOYENNE : Important, planifier prochainement
- 🟢 BASSE : Nice-to-have, amélioration marginale
- ⚠️ TODO : Non commencé
- 🟡 PARTIEL : Partiellement implémenté
- ⏳ EN COURS : En cours de surveillance
- ✅ FAIT : Terminé

---

## 🎯 Score Final Projeté

**Après implémentation de toutes les recommandations HAUTE/MOYENNE priorité**:

| Métrique         | Actuel | Projeté | Amélioration |
| ---------------- | ------ | ------- | ------------ |
| **Score Global** | 85/100 | 92/100  | +7           |
| **Sécurité**     | 75/100 | 95/100  | +20          |
| **Performance**  | 70/100 | 85/100  | +15          |
| **Tests**        | 85/100 | 90/100  | +5           |
| **Architecture** | 95/100 | 95/100  | =            |
| **Bundle**       | ~180kB | <150kB  | -30kB        |
| **Vulns**        | 4      | 0       | -4           |

---

## 📝 Références

- **Audit Technique**: `docs/audits/audit-technique-complet.md`
- **Audit KISS**: `docs/audits/audit-kiss-verification-finale.md`
- **Audit SOLID**: `docs/audits/audit-solid-principles.md`
- **Audit Lisibilité**: `docs/audits/audit-code-readability.md`

---

**Dernière mise à jour**: 26 octobre 2025
**Prochaine révision**: Après Phase Immédiate (updates sécurité)
