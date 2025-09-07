# Picture Component - Interface Segregation Examples

## SOLID ISP Implementation

Ce composant implémente le principe d'Interface Segregation avec des interfaces spécialisées.

### 1. CorePictureProps - Usage de base
```tsx
import Picture from '@/components/common/Picture';

// Usage minimal avec les propriétés essentielles
<Picture 
  srcBase="/images/product" 
  alt="Description du produit" 
/>
```

### 2. OptimizedPictureProps - Images critiques (LCP/Hero)
```tsx
import { OptimizedPicture } from '@/components/common/Picture';

// Interface spécialisée pour les images Above-the-Fold
<OptimizedPicture
  srcBase="/photos/hero"
  alt="Image principale"
  priority={true}  // Requis par l'interface
  fallbackSrc="/photos/hero-fallback.jpg"
/>
```

### 3. ResponsivePictureProps - Images responsives
```tsx
import { ResponsivePicture } from '@/components/common/Picture';

// Interface spécialisée pour le contrôle responsive
<ResponsivePicture
  srcBase="/photos/gallery"
  alt="Photo de la galerie"
  width={800}      // Requis par l'interface
  height={600}     // Requis par l'interface  
  sizes="(min-width: 1200px) 800px, 100vw"  // Requis
/>
```

## Avantages SOLID ISP

### ✅ Interface Segregation
- **Séparation des préoccupations** : Chaque interface a une responsabilité claire
- **Pas de propriétés inutiles** : Les clients n'implémentent que ce dont ils ont besoin
- **Type safety renforcée** : Les propriétés requises sont explicites

### ✅ Compatibilité ascendante
- L'interface `PictureProps` universelle reste disponible
- Tous les usages existants continuent de fonctionner
- Migration progressive possible

### ✅ Maintenabilité
- Interfaces explicites et documentées
- Tests spécialisés pour chaque cas d'usage
- Code plus lisible et intentionnel