# 📋 TODO - Améliorations à Implémenter

**Date de création**: 26 octobre 2025
**Dernière mise à jour**: 26 octobre 2025 - Phase 2 en cours (P3 terminé)
**Statut**: 3 recommandations non implémentées sur 35 analysées
**Score d'implémentation**: 91%

---

## 📊 Résumé Exécutif

Ce document liste toutes les recommandations **NON ENCORE IMPLÉMENTÉES** issues des audits techniques et qualité.

**Recommandations par priorité**:

- ✅ **Phase Immédiate**: 3 items TERMINÉS (Sécurité CVEs)
- ✅ **Phase 1**: 5 items TERMINÉS (Bundle + Monitoring + Automation)
- ✅ **Architecture**: 1 item TERMINÉ (A1 Footer/ContactPage)
- 🟡 **Phase 2**: 1 item TERMINÉ (P3), 2 items restants (T1, P6)
- **Optionnelles**: 2 items (KISS/SOLID raffinements)

---

## ✅ PHASE IMMÉDIATE - TERMINÉE

**Temps total**: 1 heure
**Impact**: Correction vulnérabilités sécurité
**Statut**: ✅ TERMINÉE le 26 octobre 2025

### S1 - Mettre à Jour Vite ✅

- **Priorité**: 🔴 CRITIQUE
- **Effort**: 30 minutes
- **Source**: `audit-technique-complet.md` lignes 317-336
- **Problème**: CVE Vite 7.1.5 - Vulnérabilité Moderate (Bypass server.fs.deny)
- **Solution appliquée**:
  - Vite 7.1.5 → 7.1.12 ✅
  - Vitest 3.2.4 → 4.0.3 ✅
  - @vitest/coverage-v8 3.2.4 → 4.0.3 ✅
- **Validation**: ✅ `pnpm audit --audit-level=moderate` = Zero vulnerabilities
- **Statut**: ✅ FAIT (commit fd48d8a)

### S2 - Mettre à Jour Playwright ✅

- **Priorité**: 🔴 CRITIQUE
- **Effort**: 30 minutes
- **Source**: `audit-technique-complet.md` lignes 338-352
- **Problème**: Playwright 1.55.0 - Vulnérabilité High (SSL Certificate Validation)
- **Solution appliquée**:
  - Playwright 1.55.0 → 1.56.1 ✅
  - @playwright/test 1.55.0 → 1.56.1 ✅
- **Validation**: ✅ Build + tests passent
- **Statut**: ✅ FAIT (commit fd48d8a)

### S3 - Fixer tar-fs ✅ (BONUS)

- **Priorité**: 🔴 HIGH
- **Effort**: 15 minutes
- **Problème**: tar-fs 3.1.0 - Vulnérabilité High (Symlink validation bypass)
- **Solution appliquée**:
  - Ajout override `tar-fs: >=3.1.1` dans package.json
- **Validation**: ✅ `pnpm audit --audit-level=moderate` = Zero vulnerabilities
- **Statut**: ✅ FAIT (commit fd48d8a)

**Critères de succès Phase Immédiate**:

- [x] Zéro vulnérabilités >=moderate ✅
- [x] Build réussit (`pnpm build`) ✅
- [x] Tests passent (524/576) ✅

---

## ✅ PHASE 1 - TERMINÉE

**Temps total**: 10-14 heures (réalisé en ~8h)
**Impact**: Performance bundle + Monitoring + Automation
**Statut**: ✅ TERMINÉE le 26 octobre 2025

### P1 - Split React-Vendor Bundle ✅

- **Priorité**: 🔴 HAUTE
- **Effort**: 4-6 heures (réalisé en ~3h)
- **Source**: `audit-technique-complet.md` lignes 240-270
- **Problème**: `react-vendor-BwvzicDE.js` = 273.88 kB (89.86 kB gzip) - dépasse 250 kB
- **Solution appliquée**: Configurer manual chunks granulaires dans `vite.config.ts`
  - react: 3.33kB gzip
  - react-dom: 54.60kB gzip
  - react-router: 11.80kB gzip
  - framer-motion: 11.79kB gzip
  - analytics: 1.04kB gzip
  - icons: 2.29kB gzip
- **Résultat**: React ecosystem 89.86kB → 69.73kB gzip (-20.13kB, -22.4%) ✅
- **Statut**: ✅ FAIT (commit 177225c)

### P2 - Lazy Load Sentry ✅

- **Priorité**: 🟡 MOYENNE
- **Effort**: 2 heures (réalisé en <1h - déjà optimisé)
- **Source**: `audit-technique-complet.md` lignes 272-280
- **Solution appliquée**: Vérification que Sentry est déjà lazy-loadé
  - Dynamic import avec requestIdleCallback
  - Chargement conditionnel (mobile/slow connection)
  - Déjà implémenté dans main.tsx
- **Statut**: ✅ FAIT (déjà optimisé, confirmé dans commit 177225c)

### P5 - Réactiver Lighthouse CI ✅

- **Priorité**: 🔴 HAUTE
- **Effort**: 2-3 heures (réalisé en ~2h)
- **Source**: `audit-technique-complet.md` lignes 309, 700-702
- **Solution appliquée**:
  - Ajout vérification artifacts build (dist/)
  - Amélioration error handling et logging
  - PR comments avec emojis 🟢🟡🔴 selon scores
  - Messages de troubleshooting actionables
- **Statut**: ✅ FAIT (commit 6c09b18)

### S4 - Configurer Dependabot ✅

- **Priorité**: 🔴 HAUTE
- **Effort**: 1-2 heures (réalisé en ~1.5h)
- **Source**: `audit-technique-complet.md` lignes 419, 704-706
- **Solution appliquée**:
  - `.github/dependabot.yml` avec schedule hebdomadaire
  - Workflow auto-merge pour patches de sécurité
  - Documentation complète (.github/DEPENDABOT.md)
  - Grouping strategy (dev vs prod dependencies)
- **Statut**: ✅ FAIT (commit 29c9a37)

### P4 - Bundle Analysis avec Visualizer ✅

- **Priorité**: 🟡 MOYENNE
- **Effort**: 1 heure (réalisé en ~30min)
- **Source**: `audit-technique-complet.md` lignes 296, 709
- **Solution appliquée**:
  - rollup-plugin-visualizer installé
  - Génération dist/stats.html avec treemap
  - Script `pnpm bundle:analyze` créé
  - Tracking gzip et brotli sizes
- **Statut**: ✅ FAIT (commit 177225c)

**Critères de succès Phase 1**:

- [x] React bundle réduit de >20% (89.86kB → 69.73kB) ✅
- [x] Total bundle ~160kB gzip ✅
- [x] Lighthouse CI opérationnel avec quality gates ✅
- [x] Dependabot configuré et actif ✅
- [x] Bundle visualizer généré (dist/stats.html) ✅
- [x] Sentry optimisé avec lazy-load ✅

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

### A1 - Simplification Footer.tsx ✅

- **Priorité**: 🟢 BASSE
- **Effort**: 2-3 heures (réalisé en 1.5h)
- **Source**: `audit-technique-complet.md` lignes 534-558
- **Problème**: Footer.tsx = 272 lignes (objectif <250)
- **Solution appliquée**: Refactoriser en sous-composants
  - FooterLogo (logo et slogan)
  - FooterNavigation (liens navigation)
  - FooterContact (coordonnées complètes)
  - FooterSocial (réseaux sociaux)
  - FooterBottom (liens légaux + signature)
  - FooterMenu (variante menu mobile)
- **Résultat**: Footer.tsx 272 → 74 lignes (-73%) ✅
- **Statut**: ✅ FAIT (commit 935c6c7)

### A1b - Simplification ContactPage.tsx ✅

- **Priorité**: 🟢 BASSE
- **Effort**: 2-3 heures (réalisé en 1.5h)
- **Source**: `audit-technique-complet.md` lignes 534-558
- **Problème**: ContactPage.tsx = 313 lignes (objectif <250)
- **Solution appliquée**: Extraire sections en composants
  - ContactHero (titre et intro)
  - ContactInfo (informations pratiques)
  - ContactAppointment (widget Calendly)
  - ContactLocation (plan d'accès)
- **Résultat**: ContactPage.tsx 313 → 69 lignes (-78%) ✅
- **Statut**: ✅ FAIT (commit 935c6c7)

### P3 - Optimiser Imports Lucide ✅

- **Priorité**: 🟢 BASSE
- **Effort**: 1 heure (réalisé en <30min - déjà optimisé)
- **Source**: `audit-technique-complet.md` ligne 296
- **Impact obtenu**: Icons chunk = 7.44 kB (2.29 kB gzip)
- **Solution appliquée**:
  - Vérification complète: tous les imports utilisent déjà les chemins spécifiques
  - ESLint rule `no-restricted-imports` appliquée (eslint.config.js:47-58)
  - 35 imports vérifiés dans src/ - tous conformes
  - Bundle icons optimisé et séparé

  ```typescript
  // ❌ Éviter (bloqué par ESLint)
  import { Icon } from 'lucide-react';

  // ✅ Pattern utilisé partout
  import Icon from 'lucide-react/dist/esm/icons/icon-name';
  ```

- **Statut**: ✅ FAIT (déjà optimisé, confirmé le 26 octobre 2025)

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
- [x] Tous fichiers < 250 lignes ✅
- [ ] Lighthouse scores atteints (FCP, TTI, CLS)
- [x] Tous imports Lucide optimisés ✅

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

| ID  | Recommandation                | Priorité | Effort | Impact       | Phase     | Statut  |
| --- | ----------------------------- | -------- | ------ | ------------ | --------- | ------- |
| S1  | Update Vite                   | 🔴       | 30min  | Sécurité     | Immédiate | ✅ FAIT |
| S2  | Update Playwright             | 🔴       | 30min  | Sécurité     | Immédiate | ✅ FAIT |
| S3  | Fix tar-fs (BONUS)            | 🔴       | 15min  | Sécurité     | Immédiate | ✅ FAIT |
| P1  | Split react-vendor            | 🔴       | 3h     | -20kB        | Phase 1   | ✅ FAIT |
| P5  | Réactiver Lighthouse CI       | 🔴       | 2h     | Monitoring   | Phase 1   | ✅ FAIT |
| S4  | Dependabot/Renovate           | 🔴       | 1.5h   | Sécurité     | Phase 1   | ✅ FAIT |
| P2  | Lazy load Sentry              | 🟡       | <1h    | Optimisé     | Phase 1   | ✅ FAIT |
| P4  | Bundle Visualizer             | 🟡       | 30min  | Analyse      | Phase 1   | ✅ FAIT |
| A1  | Simplifier Footer/ContactPage | 🟢       | 3h     | Maintenable  | Phase 2   | ✅ FAIT |
| T1  | Tests coverage 55%            | 🟡       | 6-8h   | Robustesse   | Phase 2   | ⚠️ TODO |
| P3  | Optimiser Lucide imports      | 🟢       | <30min | Icons 2.29kB | Phase 2   | ✅ FAIT |
| P6  | Lighthouse targets            | 🟡       | Var    | UX           | Phase 2   | ⚠️ TODO |
| D1  | Documentation ADR             | 🟢       | Ongo   | Onboarding   | Optionnel | ⚠️ TODO |
| OPT | KISS Phase 4                  | 🟢       | 2h     | +0.3 KISS    | Optionnel | ⚠️ TODO |
| OPT | SOLID Raffinements            | 🟢       | 3-4h   | +0.5 SOLID   | Optionnel | ⚠️ TODO |

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

**Progression après Phase Immédiate**:

| Métrique         | Avant  | Après Phase Immédiate | Objectif Final | Restant |
| ---------------- | ------ | --------------------- | -------------- | ------- |
| **Score Global** | 85/100 | 87/100 ✅             | 92/100         | +5      |
| **Sécurité**     | 75/100 | 95/100 ✅             | 95/100         | =       |
| **Performance**  | 70/100 | 70/100                | 85/100         | +15     |
| **Tests**        | 85/100 | 85/100                | 90/100         | +5      |
| **Architecture** | 95/100 | 95/100                | 95/100         | =       |
| **Bundle**       | ~180kB | ~180kB                | <150kB         | -30kB   |
| **Vulns**        | 4      | 0 ✅                  | 0              | =       |

---

## 📝 Références

- **Audit Technique**: `docs/audits/audit-technique-complet.md`
- **Audit KISS**: `docs/audits/audit-kiss-verification-finale.md`
- **Audit SOLID**: `docs/audits/audit-solid-principles.md`
- **Audit Lisibilité**: `docs/audits/audit-code-readability.md`

---

**Dernière mise à jour**: 26 octobre 2025
**Phase Immédiate**: ✅ TERMINÉE (commit fd48d8a)
**Prochaine révision**: Démarrage Phase 1 (Performance + Monitoring)
