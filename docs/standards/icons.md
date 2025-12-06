# 🎨 Standards - Utilisation des Icônes

Ce document définit les standards et bonnes pratiques pour l'utilisation des icônes Lucide dans le projet.

---

## 📋 Table des Matières

1. [Principes Généraux](#principes-généraux)
2. [Pattern 1: Icon Registry](#pattern-1-icon-registry)
3. [Pattern 2: Composant Wrapper](#pattern-2-composant-wrapper)
4. [Pattern 3: Registry Local](#pattern-3-registry-local)
5. [Pattern 4: Import Direct (Hardcodé)](#pattern-4-import-direct-hardcodé)
6. [Arbre de Décision](#arbre-de-décision)
7. [Exemples Concrets](#exemples-concrets)
8. [Anti-Patterns](#anti-patterns)

---

## Principes Généraux

### 🎯 Objectifs

1. **Éviter la duplication** - Centraliser les imports d'icônes réutilisées
2. **Séparer data/UI** - Les données ne doivent pas importer de composants React
3. **Type safety** - Utiliser TypeScript pour valider les noms d'icônes
4. **Maintenabilité** - Faciliter les changements futurs

### 📦 Import des Icônes

**✅ TOUJOURS utiliser des imports spécifiques:**

```typescript
// ✅ BON - Import spécifique (obligatoire, rule ESLint)
import Star from 'lucide-react/dist/esm/icons/star';

// ❌ INTERDIT - Import root (bloqué par ESLint)
import { Star } from 'lucide-react';
```

**Raison:** Bundle size optimization (tree-shaking)

---

## Pattern 1: Icon Registry

### Quand l'utiliser

- ✅ Icônes associées à des **données** (config, listes)
- ✅ Icônes **réutilisées dans 3+ composants**
- ✅ Icônes qui peuvent **changer** selon le contenu
- ✅ Besoin de **séparer data layer / UI layer**

### Comment l'implémenter

#### Étape 1: Créer le registry

```typescript
// lib/iconRegistry.ts
import Facebook from 'lucide-react/dist/esm/icons/facebook';
import Instagram from 'lucide-react/dist/esm/icons/instagram';
import type { LucideIcon } from '@/types/lucide-react-icons';

/**
 * Registry des icônes sociales
 */
export const socialIconRegistry: Record<string, LucideIcon> = {
  facebook: Facebook,
  instagram: Instagram,
} as const;

/**
 * Type helper pour extraire les clés du registry
 */
export type SocialIconName = keyof typeof socialIconRegistry;
```

#### Étape 2: Utiliser dans la data layer

```typescript
// config/footer.ts
import type { SocialIconName } from '@/lib/iconRegistry';

export interface SocialLink {
  label: string;
  href: string;
  iconName: SocialIconName; // ✅ Type-safe
}

export const FOOTER_SOCIALS: SocialLink[] = [
  { label: 'Facebook', href: '...', iconName: 'facebook' },
  { label: 'Instagram', href: '...', iconName: 'instagram' },
];
```

#### Étape 3: Résoudre dans les composants

```typescript
// components/footer/FooterSocial.tsx
import { socialIconRegistry } from '@/lib/iconRegistry';
import { FOOTER_SOCIALS } from '@/config/footer';

export default function FooterSocial() {
  return (
    <div>
      {FOOTER_SOCIALS.map((social) => {
        const Icon = socialIconRegistry[social.iconName]; // ✅ Résolution dynamique
        return <Icon className="h-5 w-5" key={social.href} />;
      })}
    </div>
  );
}
```

### Avantages

✅ **Source unique** - 1 endroit pour modifier les icônes
✅ **Type-safe** - TypeScript valide les noms d'icônes
✅ **Data layer pure** - Aucune dépendance UI dans config/data
✅ **Extensible** - Ajouter LinkedIn = 2 lignes

### Exemples dans le projet

- **Icônes sociales** - `socialIconRegistry` (Facebook, Instagram)
  - Utilisé par: FooterSocial, FooterMenu, FullScreenMenu

### Quand NE PAS l'utiliser

- ❌ Icônes utilisées **1-2 fois** uniquement
- ❌ Icônes **universelles** (MapPin, Phone) peu susceptibles de changer
- ❌ Sur-ingénierie pour gain minime

---

## Pattern 2: Composant Wrapper

### Quand l'utiliser

- ✅ **Logique d'affichage répétée** avec variations
- ✅ Icône utilisée **2+ fois** avec styles similaires
- ✅ **Besoin de réutilisabilité** dans différents contextes

### Comment l'implémenter

#### Créer le composant

```typescript
// components/common/RatingStars.tsx
import Star from 'lucide-react/dist/esm/icons/star';

interface RatingStarsProps {
  rating: number;
  size?: string;
  className?: string;
}

/**
 * Affiche une note sous forme d'étoiles (0-5)
 */
export function RatingStars({ rating, size = 'h-5 w-5', className = '' }: RatingStarsProps) {
  const clampedRating = Math.max(0, Math.min(5, rating));

  return (
    <div className={`flex gap-1 ${className}`} role="img" aria-label={`Note: ${clampedRating} sur 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${size} ${i < clampedRating ? 'fill-accent text-accent' : 'text-stone/30'}`}
        />
      ))}
    </div>
  );
}
```

#### Utiliser dans les composants

```typescript
// sections/Testimonials.tsx
import { RatingStars } from '@/components/common/RatingStars';

export default function Testimonials() {
  return (
    <div>
      {TESTIMONIALS.map((testimonial) => (
        <div key={testimonial.id}>
          <RatingStars rating={testimonial.rating} />
          <p>{testimonial.quote}</p>
        </div>
      ))}
    </div>
  );
}
```

### Avantages

✅ **Réutilisable** - Utilisable partout dans l'app
✅ **Props flexibles** - Customisation via props
✅ **Logique centralisée** - 1 endroit pour modifications
✅ **Code simplifié** - Intent clair en 1 ligne

### Exemples dans le projet

- **RatingStars** - Affichage de notes avec étoiles
  - Props: `rating`, `size`, `className`
  - Utilisé par: Testimonials

### Quand NE PAS l'utiliser

- ❌ Icône simple sans logique (utiliser import direct)
- ❌ Pattern non répété (1 seul usage)

---

## Pattern 3: Registry Local

### Quand l'utiliser

- ✅ Icônes liées à **1 seul composant**
- ✅ **Data layer pure** nécessaire (ex: data/about.ts)
- ✅ Pas besoin de registry global

### Comment l'implémenter

#### Data layer (pure)

```typescript
// data/about.ts
export type IconName = 'heart' | 'leaf' | 'award';

export interface ValueData {
  title: string;
  description: string;
  iconName: IconName; // ✅ String, pas de dépendance UI
}

export const VALUES_DATA: ValueData[] = [
  { title: 'Authenticité', description: '...', iconName: 'heart' },
  { title: 'Écologie', description: '...', iconName: 'leaf' },
  { title: 'Expertise', description: '...', iconName: 'award' },
];
```

#### Composant (UI layer)

```typescript
// sections/about/AboutValues.tsx
import Heart from 'lucide-react/dist/esm/icons/heart';
import Leaf from 'lucide-react/dist/esm/icons/leaf';
import Award from 'lucide-react/dist/esm/icons/award';
import { VALUES_DATA } from '@/data/about';

// Registry local dans le composant
const iconMap = {
  heart: Heart,
  leaf: Leaf,
  award: Award,
} as const;

export default function AboutValues() {
  return (
    <div>
      {VALUES_DATA.map((value) => {
        const Icon = iconMap[value.iconName]; // ✅ Résolution dynamique
        return (
          <div key={value.title}>
            <Icon className="h-8 w-8" />
            <h3>{value.title}</h3>
          </div>
        );
      })}
    </div>
  );
}
```

### Avantages

✅ **Data layer pure** - Sérialisable, testable
✅ **Type-safe** - Union type `IconName`
✅ **Pas de sur-ingénierie** - Registry limité au scope nécessaire
✅ **Séparation concerns** - Data vs UI

### Exemples dans le projet

- **AboutValues** - Icônes des valeurs (Heart, Leaf, Award)
  - Data: `data/about.ts` (pure)
  - Registry local: `sections/about/AboutValues.tsx`

### Quand NE PAS l'utiliser

- ❌ Icônes réutilisées dans **plusieurs composants** (utiliser registry global)
- ❌ Pas besoin de data layer pure (utiliser import direct)

---

## Pattern 4: Import Direct (Hardcodé)

### Quand l'utiliser

- ✅ Icône utilisée **1 seule fois** dans l'app
- ✅ Icône **liée à la logique** du composant
- ✅ Icône **universelle** peu susceptible de changer
- ✅ Pas de duplication ni besoin de registry

### Comment l'implémenter

```typescript
// components/legal/PrintButton.tsx
import Printer from 'lucide-react/dist/esm/icons/printer';

export function PrintButton() {
  return (
    <button onClick={window.print}>
      <Printer className="h-5 w-5" />
      Imprimer
    </button>
  );
}
```

### Avantages

✅ **Simple** - Pas d'abstraction inutile
✅ **Clair** - Intent évident
✅ **Performant** - Pas de mapping overhead

### Exemples dans le projet

- **Printer** - PrintButton (impression page légale)
- **ArrowUp** - ScrollToTopButton (retour en haut)
- **Car, Train** - ContactLocation (moyens de transport)
- **Clock** - ContactInfo (horaires d'ouverture)
- **MapPin, Phone, Mail** - Icônes contact (universelles, stables)

### Quand NE PAS l'utiliser

- ❌ Icône **dupliquée** dans plusieurs fichiers (utiliser registry ou composant)
- ❌ Icône dans **data layer** (utiliser registry)

---

## Arbre de Décision

```
┌─────────────────────────────────────────┐
│ Ai-je besoin d'utiliser une icône ?     │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ L'icône est-elle dans la data layer (config/data) ?         │
└────────────────┬──────────────────────────┬─────────────────┘
                 │ OUI                      │ NON
                 ▼                          ▼
┌────────────────────────────────┐  ┌──────────────────────────────┐
│ Est-elle réutilisée            │  │ L'icône est-elle dupliquée   │
│ dans 3+ composants ?           │  │ dans plusieurs fichiers ?    │
└─────────┬──────────────┬───────┘  └────────┬─────────────┬───────┘
          │ OUI          │ NON               │ OUI         │ NON
          ▼              ▼                   ▼             ▼
    ┌─────────┐    ┌──────────┐      ┌──────────┐  ┌──────────┐
    │ Pattern │    │ Pattern  │      │ Pattern  │  │ Pattern  │
    │    1    │    │    3     │      │    2     │  │    4     │
    │ Registry│    │ Registry │      │Composant │  │ Import   │
    │ Global  │    │  Local   │      │ Wrapper  │  │ Direct   │
    └─────────┘    └──────────┘      └──────────┘  └──────────┘
```

---

## Exemples Concrets

### Exemple 1: Ajouter Icône Twitter

**Contexte:** Ajouter Twitter aux réseaux sociaux

#### ✅ Solution Correcte

```typescript
// 1. lib/iconRegistry.ts
import Twitter from 'lucide-react/dist/esm/icons/twitter';
export const socialIconRegistry = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter, // ✅ 1 ligne
};

// 2. config/footer.ts
export const FOOTER_SOCIALS = [
  // ...
  { label: 'Twitter', href: '...', iconName: 'twitter' }, // ✅ 1 ligne
];

// ✅ FooterSocial, FooterMenu, FullScreenMenu automatiquement mis à jour!
```

**Fichiers modifiés:** 2
**Composants mis à jour:** 3 (automatique)

---

### Exemple 2: Ajouter Rating dans ProductCard

**Contexte:** Afficher note produit avec étoiles

#### ✅ Solution Correcte

```typescript
// components/products/ProductCard.tsx
import { RatingStars } from '@/components/common/RatingStars';

export function ProductCard({ product }) {
  return (
    <div>
      <h3>{product.name}</h3>
      <RatingStars rating={product.averageRating} size="h-4 w-4" />
    </div>
  );
}
```

**Bénéfice:** Réutilise composant existant, 1 ligne

---

### Exemple 3: Ajouter Icône Shipping

**Contexte:** Afficher icône livraison (usage unique)

#### ✅ Solution Correcte

```typescript
// components/checkout/ShippingInfo.tsx
import Truck from 'lucide-react/dist/esm/icons/truck';

export function ShippingInfo() {
  return (
    <div>
      <Truck className="h-5 w-5 text-accent" />
      <p>Livraison gratuite</p>
    </div>
  );
}
```

**Bénéfice:** Simple, pas d'over-engineering

---

## Anti-Patterns

### ❌ Anti-Pattern 1: Registry pour Icône Unique

```typescript
// ❌ MAUVAIS - Over-engineering
export const utilityIconRegistry = {
  printer: Printer, // Utilisé 1 fois uniquement
};

// ✅ BON - Import direct
import Printer from 'lucide-react/dist/esm/icons/printer';
```

**Problème:** Complexité > Bénéfice

---

### ❌ Anti-Pattern 2: Importer Icône dans Data Layer

```typescript
// ❌ MAUVAIS - Data layer dépend de UI
// data/about.ts
import Heart from 'lucide-react/dist/esm/icons/heart';
export const VALUES_DATA = [
  { icon: Heart }, // ❌ Composant React dans data
];

// ✅ BON - Data layer pure
// data/about.ts
export const VALUES_DATA = [
  { iconName: 'heart' }, // ✅ String
];
```

**Problème:** Viole séparation data/UI

---

### ❌ Anti-Pattern 3: Import Root

```typescript
// ❌ MAUVAIS - Import root (bundle size)
import { Star } from 'lucide-react';

// ✅ BON - Import spécifique
import Star from 'lucide-react/dist/esm/icons/star';
```

**Problème:** Bundle size increase, bloqué par ESLint

---

### ❌ Anti-Pattern 4: Duplication Sans Registry

```typescript
// ❌ MAUVAIS - Duplication dans 5 fichiers
// ComponentA.tsx
import Facebook from 'lucide-react/dist/esm/icons/facebook';

// ComponentB.tsx
import Facebook from 'lucide-react/dist/esm/icons/facebook';

// ComponentC.tsx
import Facebook from 'lucide-react/dist/esm/icons/facebook';

// ✅ BON - Registry centralisé
// lib/iconRegistry.ts
export const socialIconRegistry = { facebook: Facebook };
```

**Problème:** Maintenance difficile, pas de source unique

---

## 📚 Ressources

### Documentation Projet

- [Audit Icons Complet](../audits/audit-icons-complete.md)
- [Refactoring Phase 1 - Social Icons](../audits/refactoring-icons-phase1.md)
- [Refactoring Phase 2 - RatingStars](../audits/refactoring-icons-phase2.md)

### Exemples de Code

**Icon Registry:**

- `src/lib/iconRegistry.ts`
- `src/config/footer.ts`
- `src/components/footer/FooterSocial.tsx`

**Composant Wrapper:**

- `src/components/common/RatingStars.tsx`
- `src/sections/Testimonials.tsx`

**Registry Local:**

- `src/data/about.ts`
- `src/sections/about/AboutValues.tsx`

**Import Direct:**

- `src/components/legal/PrintButton.tsx`
- `src/components/common/ScrollToTopButton.tsx`

---

## 🔄 Maintenance

### Ajouter une Nouvelle Icône

1. **Identifier le pattern approprié** (voir arbre de décision)
2. **Suivre les exemples** du pattern choisi
3. **Vérifier TypeScript** (`pnpm typecheck`)
4. **Vérifier Build** (`pnpm build`)

### Modifier une Icône Existante

1. **Identifier le pattern utilisé**
2. **Si registry:** Modifier 1 fichier (registry ou data)
3. **Si composant:** Modifier le composant wrapper
4. **Si hardcodé:** Modifier le fichier d'usage

### Refactoriser une Icône

**Indicateurs de refactoring:**

- Icône dupliquée 3+ fois → Créer registry
- Logique répétée → Créer composant wrapper
- Icône dans data layer → Extraire en registry

---

**Version:** 1.0.0
**Dernière mise à jour:** 10 novembre 2025
**Auteur:** Équipe La Lunetterie du Coin
