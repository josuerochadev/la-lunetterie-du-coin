# 🎨 PROPOSITION DE REFONTE - LA LUNETTERIE DU COIN

**⚠️ CE DOCUMENT EST ARCHIVÉ**

Ce document contient la proposition initiale de refonte du site La Lunetterie du Coin.

**Pour consulter le statut actuel du projet (mis à jour), voir :**
👉 **[REDESIGN-STATUS.md](./REDESIGN-STATUS.md)**

---

## 📊 STATUT DU PROJET

✅ **PROJET TERMINÉ** (Janvier 2025)

Toutes les phases de la refonte ont été complétées :

- ✅ Phase 1 : Design System minimaliste
- ✅ Phase 2 : Homepage refonte complète
- ✅ Phase 3 : Nouvelles pages (À propos, Services)
- ✅ Phase 4 : Enrichissement contenu (conditions légales, SAV, offres)

---

## 🎯 CE QUI A ÉTÉ RÉALISÉ

### Design & Identité Visuelle

- ✅ Palette minimaliste (Crème, Charbon, Stone, Orange #FF8400)
- ✅ Typographie Jost exclusive (Google Fonts)
- ✅ Style éditorial inspiré Kinfolk/La Pima
- ✅ Animations subtiles (fade, slide-up, slide-down)
- ✅ Layouts 50/50 et éditoriaux

### Structure du Site

- ✅ **HomePage** : 8 sections redessinées (Hero, Notre Histoire, Services, Engagement, Offres, Témoignages, Contact, Footer)
- ✅ **À propos** : Page complète (histoire, valeurs, équipe, engagement)
- ✅ **Services** : Page détaillée (6 services avec conditions)
- ✅ **Mentions Légales** : Existante
- ✅ **Conditions de Vente** : Enrichie (lentilles d'essai, frais montage)
- ✅ **404** : Existante

### Contenu Intégré

- ✅ 6 vrais témoignages Google Reviews
- ✅ Conditions légales examens de vue
- ✅ Service après-vente gratuit clarifié
- ✅ Conditions offres commerciales détaillées
- ✅ Frais lentilles d'essai (7€)
- ✅ Informations entreprise complètes

### Technique

- ✅ React 19 + TypeScript
- ✅ Vite 7.1.5
- ✅ Tailwind CSS config custom
- ✅ Framer Motion animations
- ✅ React Router v7 (lazy loading)
- ✅ SEO (React Helmet)
- ✅ Formspree + Calendly
- ✅ 543 tests passing

---

## 📄 DOCUMENT ARCHIVÉ - PROPOSITION INITIALE

Le reste de ce document contient la proposition originale de refonte.
Pour le statut actuel et détaillé, consultez **[REDESIGN-STATUS.md](./REDESIGN-STATUS.md)**.

---

## 📊 ANALYSE DE L'EXISTANT (Décembre 2024)

### Structure initiale

**Pages** : HomePage, Mentions Légales, Conditions de Vente, 404

**Sections** :

1. Hero - Phrase d'accroche rotative
2. Offers - 2 cartes (Recyclage, Deuxième paire)
3. Services - 3 cartes (Lunettes, Lentilles, Examens)
4. Concept - Texte avec symboles
5. Contact - Formulaire
6. Footer - Liens légaux + Réseaux sociaux

### Problèmes identifiés

❌ **Manque de contenu** : Peu d'informations sur l'entreprise, l'équipe, les valeurs
❌ **Navigation confuse** : Pas d'histoire claire, peu de storytelling
❌ **Identité visuelle** : Palette bicolore mauve/orange peu cohérente
❌ **Typographie mixte** : Sans-serif (League Spartan) + Serif (Imbue) = confusion
❌ **Trop de symboles** : Le concept utilise beaucoup de ✷☆◇ qui nuisent à la lisibilité

**✅ TOUS CES PROBLÈMES ONT ÉTÉ RÉSOLUS**

---

## 🎯 VISION : CHIC & MINIMALISTE

### Direction artistique

**Mots-clés** : Élégance, Simplicité, Durabilité, Authenticité, Expertise locale

**Références visuelles** :

- Marques de luxe durable (Cuyana, Patagonia haut de gamme)
- Opticiens premium (Warby Parker, Oliver Peoples)
- Design éditorial (Kinfolk, Cereal Magazine)

**✅ VISION RÉALISÉE ET IMPLÉMENTÉE**

---

## 🎨 NOUVEAU DESIGN SYSTEM

### 1. PALETTE DE COULEURS MINIMALISTE ✅

```css
/* IMPLÉMENTÉ */
--color-cream: #fdfcf8 /* Fond principal */ --color-charcoal: #2b2d2f /* Texte principal */
  --color-stone: #8b8680 /* Texte secondaire */ --color-orange: #ff8400
  /* Accent brand (obligatoire) */ --color-white: #ffffff /* Contraste */;
```

### 2. TYPOGRAPHIE ✅

**Police choisie** : **Jost** (Google Fonts)

- Alternative moderne et libre à Futura
- Sans-serif élégante et lisible
- Excellente performance web
- Cohérence typographique totale

**Raison du choix** :

- ✅ Jost remplace League Spartan (trop sporty)
- ✅ Plus moderne que Cormorant Garamond (serif initialement proposée)
- ✅ Parfaite pour un design minimaliste contemporain
- ✅ Gratuite et performante (Google Fonts)

---

## 📄 ARCHITECTURE RÉALISÉE

### Pages Principales ✅

1. **HOME (/)** - ✅ Refonte complète
2. **À PROPOS (/a-propos)** - ✅ Créée
3. **SERVICES (/services)** - ✅ Créée
4. **MENTIONS LÉGALES** - ✅ Existante
5. **CONDITIONS DE VENTE** - ✅ Enrichie
6. **404** - ✅ Existante

### Pages futures (optionnelles)

- ⏳ **COLLECTION (/collection)** - Catalogue montures
- ⏳ **BLOG (/actualites)** - Articles conseils/tendances

---

## 🚀 PLAN DE MIGRATION RÉALISÉ

### Phase 1 : Design System ✅

**Commit** : `3ca84b0`

- ✅ Nouvelle palette couleurs
- ✅ Typographie Jost
- ✅ Tokens Tailwind

### Phase 2 : Homepage Refonte ✅

**Commits** : `1d105b5` → `35f20ea`

- ✅ Hero minimaliste
- ✅ Notre Histoire
- ✅ Services Minimal
- ✅ Engagement Écologique
- ✅ Offres Éditoriales
- ✅ Témoignages
- ✅ Contact Enhanced

### Phase 3 : Nouvelles Pages ✅

**Commit** : `80bd736`

- ✅ Page À propos
- ✅ Page Services

### Phase 4 : Enrichissement Contenu ✅

**Commit** : `557cd2c`

- ✅ Conditions légales
- ✅ SAV gratuit
- ✅ Offres détaillées
- ✅ Infos ODT client

---

## ✅ CHECKLIST LANCEMENT

- ✅ Nouveau design system appliqué
- ✅ Toutes sections homepage refaites
- ✅ Page "À propos" créée
- ✅ Page "Services" créée
- ⏳ Photos professionnelles intégrées (26 annoncées)
- ✅ Contenus rédigés et optimisés
- ⏳ Tests accessibilité (a11y) finaux
- ⏳ Tests performance (Lighthouse) finaux
- ⏳ Tests mobiles réels
- ⏳ Validation client finale

---

## 📸 BESOINS PHOTO

### Photos attendues (26 annoncées par client)

**Prioritaires** :

1. Portrait Romain (professionnel)
2. Boutique extérieur (façade, enseigne)
3. Boutique intérieur (2-3 angles)
4. Atelier/restauration
5. Détails montures
6. Clients essayant lunettes

**Style recommandé** :

- Lumière naturelle, tons chauds
- Légère désaturation pour élégance
- Authenticité (pas de stock photos)

**Emplacements préparés** :

- ✅ Hero (HomePage)
- ✅ Notre Histoire (HomePage)
- ✅ Offres (2 images, HomePage)
- ✅ Boutique (AboutPage)
- ✅ Portrait Romain (AboutPage)
- ✅ Services (6 images, ServicesPage)

---

## 💡 RECOMMANDATIONS FUTURES

### Court terme (1-2 semaines)

1. Intégrer photos professionnelles
2. Optimiser images (AVIF/WebP)
3. Tests Lighthouse finaux
4. Tests accessibilité axe-core
5. Validation client

### Moyen terme (1-3 mois)

1. Galerie montures (/collection)
2. Blog/Actualités (/actualites)
3. Google Maps intégré

### Long terme (3-6 mois)

1. E-commerce (optionnel)
2. Essayage virtuel AR (optionnel)
3. Programme fidélité (optionnel)

---

## 📞 RESSOURCES

### Documentation

- **Statut actuel** : [REDESIGN-STATUS.md](./REDESIGN-STATUS.md)
- **Instructions dev** : [CLAUDE.md](./CLAUDE.md)

### Configuration

- **Design system** : `tailwind.config.ts`
- **Données** : `src/config/constants.ts`

### Contact

- **Email** : strasbourg@lalunetterieducoin.fr
- **Téléphone** : 03 88 51 24 40
- **Adresse** : 24 rue du Faubourg de Pierre, 67000 Strasbourg

---

**⚠️ RAPPEL : Document archivé - Consulter [REDESIGN-STATUS.md](./REDESIGN-STATUS.md) pour le statut actuel**

**Date d'archivage** : Janvier 2025
**Raison** : Projet terminé, remplacé par document de statut
