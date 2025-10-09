# 🎨 PROPOSITION DE REFONTE - LA LUNETTERIE DU COIN

## 📊 ANALYSE DE L'EXISTANT

### Structure actuelle

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

---

## 🎯 VISION : CHIC & MINIMALISTE

### Direction artistique

**Mots-clés** : Élégance, Simplicité, Durabilité, Authenticité, Expertise locale

\*\*Référ

ences visuelles\*\* :

- Marques de luxe durable (Cuyana, Patagonia haut de gamme)
- Opticiens premium (Warby Parker, Oliver Peoples)
- Design éditorial (Kinfolk, Cereal Magazine)

---

## 🎨 NOUVEAU DESIGN SYSTEM

### 1. PALETTE DE COULEURS MINIMALISTE

```css
/* PALETTE PRINCIPALE */
--color-primary: #e85d04; /* Orange chaleureux (brand) */
--color-cream: #fdfcf8; /* Crème (fond principal) */
--color-charcoal: #2b2d2f; /* Charbon (texte principal) */
--color-stone: #8b8680; /* Pierre (texte secondaire) */
--color-white: #ffffff; /* Blanc pur (contraste) */

/* PALETTE ACCENT (usage minimal) */
--color-sand: #e8e4dd; /* Sable (séparateurs, backgrounds subtils) */
--color-accent-dark: #b84700; /* Orange foncé (hover, focus) */
```

**Utilisation** :

- **Orange (#E85D04)** : Logo, CTA primaires, éléments à mettre en valeur (15% du site max)
- **Crème (#FDFCF8)** : Fond principal, respire l'élégance
- **Charbon (#2B2D2F)** : Tous les textes principaux
- **Pierre (#8B8680)** : Textes secondaires, métadonnées
- **Sable (#E8E4DD)** : Séparateurs, cartes, zones subtiles

### 2. TYPOGRAPHIE SERIF EXCLUSIVE

```css
/* NOUVELLE HIÉRARCHIE - SERIF ONLY */
font-family: 'Cormorant Garamond', 'Imbue', Georgia, serif;

/* Alternative : 'Crimson Pro', 'Lora', 'Libre Baskerville' */

/* Titres */
--font-display: 600;      /* Semi-bold pour titres principaux */
--font-heading: 500;      /* Medium pour sous-titres */

/* Corps */
--font-body: 400;         /* Regular pour texte courant */
--font-caption: 300;      /* Light pour légendes */

/* Tailles (garder le système clamp existant) */
title-xl: clamp(3rem, 6vw, 6rem)     /* Hero - plus grand */
title-lg: clamp(2.5rem, 4vw, 4.5rem) /* Sections */
title-md: clamp(2rem, 3vw, 3.5rem)   /* Sous-sections */
body-lg: clamp(1.125rem, 2vw, 1.5rem)/* Lead paragraphs */
body: clamp(1rem, 1.5vw, 1.125rem)   /* Corps */
```

**Raison du changement** :

- **Cormorant Garamond** : Élégante, moderne, excellent rendu écran
- **Serif exclusive** = cohérence, sophistication, lisibilité supérieure
- Remplace League Spartan (trop sporty/casual)

---

## 📄 NOUVELLE ARCHITECTURE DU SITE

### PAGES PRINCIPALES

#### 1. **HOME (/)** - L'expérience complète

```
└─ Hero Épuré
└─ Notre Histoire (nouveau)
└─ Nos Services
└─ Engagement Écologique (refonte Concept)
└─ Offres Spéciales
└─ Témoignages (nouveau)
└─ Contact
```

#### 2. **À PROPOS (/a-propos)** - NOUVEAU

```
└─ Notre fondateur (Romain)
└─ Notre vision
└─ Nos valeurs
└─ Notre boutique (photos, adresse)
```

#### 3. **SERVICES (/services)** - NOUVEAU

```
└─ Lunettes neuves
└─ Lunettes d'occasion
└─ Lentilles de contact
└─ Examens de vue
└─ Programme recyclage (détaillé)
```

#### 4. **COLLECTION (/collection)** - NOUVEAU (optionnel, futur)

```
└─ Nos montures neuves
└─ Nos montures d'occasion
└─ Filtres (style, prix, forme)
```

#### 5. **BLOG (/actualites)** - NOUVEAU (optionnel)

```
└─ Conseils lunettes
└─ Tendances
└─ Écologie
└─ Événements boutique
```

---

## 🎭 SECTIONS DÉTAILLÉES

### SECTION 1 : HERO REPENSÉ

**Avant** :

```
✷ PHRASE ALÉATOIRE ✷
LA LUNETTERIE DU COIN
[Bouton] Prendre rendez-vous
```

**Après** :

```html
<section class="hero-minimal">
  <!-- Fond crème avec subtile texture -->
  <div class="hero-content">
    <!-- Logo minimaliste (œil stylisé) -->

    <h1 class="hero-title">
      Des lunettes qui ont du style,
      <span class="text-primary">une démarche qui a du sens</span>
    </h1>

    <p class="hero-subtitle">
      Opticien indépendant à Strasbourg depuis 2016. Neuf, occasion et recyclage.
    </p>

    <div class="hero-cta">
      <a href="#rdv" class="btn-primary">Prendre rendez-vous</a>
      <a href="#story" class="btn-text">Notre histoire →</a>
    </div>
  </div>

  <!-- Photo épurée : vitrine boutique ou portrait Romain -->
  <div class="hero-image">
    <img src="/images/hero-boutique.jpg" alt="Boutique La Lunetterie du Coin" />
  </div>
</section>
```

**Style** :

- Layout : 50/50 texte/image sur desktop, stack sur mobile
- Photo noir & blanc légèrement sépia pour élégance
- Typographie grande et aérée
- Pas d'animation agressive, fade-in subtil

---

### SECTION 2 : NOTRE HISTOIRE (nouveau)

```html
<section class="our-story">
  <div class="story-grid">
    <div class="story-text">
      <span class="label">Depuis 2016</span>
      <h2>Une lunetterie différente</h2>
      <p class="lead">
        Romain Corato a ouvert La Lunetterie du Coin avec une conviction : proposer des lunettes de
        qualité tout en donnant une seconde vie aux montures.
      </p>
      <p>
        Au cœur du Faubourg de Pierre à Strasbourg, notre boutique indépendante allie expertise
        optique, style contemporain et engagement écologique. Chaque paire est sélectionnée avec
        soin, qu'elle soit neuve ou d'occasion.
      </p>
      <a href="/a-propos" class="link-arrow">En savoir plus →</a>
    </div>

    <div class="story-images">
      <!-- Grille 2x2 de photos : Romain, boutique, atelier, détail monture -->
      <img src="/images/romain-portrait.jpg" alt="Romain Corato, fondateur" />
      <img src="/images/boutique-interieur.jpg" alt="Intérieur boutique" />
      <img src="/images/atelier-restauration.jpg" alt="Atelier de restauration" />
      <img src="/images/detail-monture.jpg" alt="Détail d'une monture" />
    </div>
  </div>
</section>
```

---

### SECTION 3 : NOS SERVICES (refonte)

**Avant** : 3 cartes avec illustrations colorées

**Après** : 4 services en grille épurée

```html
<section class="services-minimal">
  <h2 class="section-title">Nos services</h2>
  <p class="section-subtitle">Une expertise complète pour prendre soin de votre vue</p>

  <div class="services-grid">
    <!-- Service 1 -->
    <article class="service-card">
      <div class="service-icon">👓</div>
      <h3>Lunettes neuves</h3>
      <p>
        Large sélection de montures contemporaines et intemporelles. Marques indépendantes et
        créateurs locaux.
      </p>
      <a href="/services#neuves" class="service-link">Découvrir →</a>
    </article>

    <!-- Service 2 -->
    <article class="service-card">
      <div class="service-icon">♻️</div>
      <h3>Lunettes d'occasion</h3>
      <p>
        Montures de seconde main restaurées avec soin. Du vintage rare aux modèles récents à petits
        prix.
      </p>
      <a href="/services#occasion" class="service-link">Découvrir →</a>
    </article>

    <!-- Service 3 -->
    <article class="service-card">
      <div class="service-icon">👁️</div>
      <h3>Examens de vue</h3>
      <p>Contrôle visuel complet réalisé par Romain, opticien diplômé avec 10 ans d'expérience.</p>
      <a href="/services#examens" class="service-link">Prendre RDV →</a>
    </article>

    <!-- Service 4 -->
    <article class="service-card">
      <div class="service-icon">👁️‍🗨️</div>
      <h3>Lentilles de contact</h3>
      <p>
        Toutes marques disponibles : Alcon, Acuvue, CooperVision. Essai et adaptation sur mesure.
      </p>
      <a href="/services#lentilles" class="service-link">Découvrir →</a>
    </article>
  </div>
</section>
```

**Style** :

- Cartes minimalistes : fond crème/sable, border subtile
- Icônes émojis ou illustrations line-art monochromes
- Grille 2x2 desktop, stack mobile
- Hover : légère élévation + orange sur lien

---

### SECTION 4 : ENGAGEMENT ÉCOLOGIQUE (refonte "Concept")

**Avant** :

```
✷ Depuis 2016, on mixe style ☆ et conscience ◇...
(Trop de symboles, difficile à lire)
```

**Après** :

```html
<section class="commitment">
  <div class="commitment-hero">
    <span class="label">Notre engagement</span>
    <h2>La mode change. La planète, non.</h2>
  </div>

  <div class="commitment-grid">
    <div class="commitment-stat">
      <span class="stat-number">70€</span>
      <span class="stat-label">de réduction maximale</span>
      <p>En rapportant vos anciennes lunettes à recycler</p>
    </div>

    <div class="commitment-stat">
      <span class="stat-number">2016</span>
      <span class="stat-label">année de création</span>
      <p>Pionniers du recyclage de lunettes à Strasbourg</p>
    </div>

    <div class="commitment-stat">
      <span class="stat-number">100%</span>
      <span class="stat-label">restaurées main</span>
      <p>Chaque monture d'occasion est nettoyée et réparée</p>
    </div>
  </div>

  <div class="commitment-text">
    <p class="lead">
      Depuis 2016, nous proposons une alternative durable au marché traditionnel de l'optique. Nos
      montures d'occasion sont soigneusement restaurées, donnant une seconde vie à des pièces qui
      auraient fini à la décharge.
    </p>
    <p>
      En rapportant vos anciennes lunettes, vous bénéficiez d'une réduction allant jusqu'à 70€ sur
      votre nouvel achat. Un geste pour votre portefeuille et pour la planète.
    </p>
    <a href="/services#recyclage" class="btn-outline"> Comment ça marche → </a>
  </div>
</section>
```

---

### SECTION 5 : OFFRES SPÉCIALES

**Avant** : 2 grandes cartes (Recyclage, Deuxième paire)

**Après** : Présentation éditoriale, moins "promo"

```html
<section class="special-offers">
  <h2 class="section-title">Nos offres</h2>

  <!-- Offre 1 : Programme recyclage -->
  <article class="offer-editorial">
    <div class="offer-visual">
      <img src="/images/recyclage-hero.jpg" alt="Programme recyclage" />
    </div>
    <div class="offer-content">
      <span class="offer-badge">Jusqu'à -70€</span>
      <h3>Programme recyclage</h3>
      <p class="offer-lead">
        Donnez une seconde vie à vos anciennes lunettes et bénéficiez d'une réduction sur votre
        nouvel achat.
      </p>
      <ul class="offer-benefits">
        <li>Toutes marques acceptées</li>
        <li>État indifférent (cassées, rayées...)</li>
        <li>Réduction immédiate en magasin</li>
        <li>Contribution écologique</li>
      </ul>
      <a href="/services#recyclage" class="btn-outline"> En savoir plus </a>
    </div>
  </article>

  <!-- Offre 2 : Deuxième paire -->
  <article class="offer-editorial reverse">
    <div class="offer-visual">
      <img src="/images/deuxieme-paire.jpg" alt="Deuxième paire" />
    </div>
    <div class="offer-content">
      <span class="offer-badge">Dès 59€</span>
      <h3>Deuxième paire avantageuse</h3>
      <p class="offer-lead">
        Une paire de soleil, une paire de secours ou un style différent pour changer d'ambiance.
      </p>
      <ul class="offer-benefits">
        <li>59€ : monture + verres unifocaux</li>
        <li>89€ : verres progressifs</li>
        <li>Verres antireflet durci ou solaires UV cat.3</li>
        <li>Origine France Garantie — Ophtalmic Vision</li>
      </ul>
      <a href="#contact" class="btn-outline"> Demander un devis </a>
    </div>
  </article>
</section>
```

---

### SECTION 6 : TÉMOIGNAGES (nouveau)

```html
<section class="testimonials">
  <h2 class="section-title">Ils nous font confiance</h2>

  <div class="testimonials-slider">
    <blockquote class="testimonial-card">
      <p class="testimonial-quote">
        "Un accueil chaleureux, des conseils personnalisés et un vrai engagement écologique. J'ai
        trouvé ma paire parfaite en seconde main à un prix imbattable."
      </p>
      <footer class="testimonial-author">
        <cite>Sophie L.</cite>
        <span class="testimonial-meta">Cliente depuis 2020</span>
      </footer>
    </blockquote>

    <!-- 2-3 autres témoignages -->
  </div>

  <!-- Note Google / Facebook -->
  <div class="social-proof">
    <div class="rating">
      <span class="stars">★★★★★</span>
      <span class="rating-text">4.9/5 sur Google (127 avis)</span>
    </div>
  </div>
</section>
```

---

### SECTION 7 : CONTACT (amélioration)

**Améliorations** :

- Formulaire minimaliste (garder l'existant mais restyler)
- Ajouter carte Google Maps interactive
- Horaires d'ouverture bien visibles
- Accès/Parking info

```html
<section class="contact">
  <div class="contact-grid">
    <!-- Formulaire (garder logique existante) -->
    <div class="contact-form">
      <h2>Nous contacter</h2>
      <p>Une question ? Un projet de lunettes ? Écrivez-nous.</p>
      <!-- Form actuel, restyled -->
    </div>

    <!-- Infos pratiques -->
    <div class="contact-info">
      <div class="info-block">
        <h3>Boutique</h3>
        <address>
          24 rue du Faubourg de Pierre<br />
          67000 Strasbourg
        </address>
      </div>

      <div class="info-block">
        <h3>Horaires</h3>
        <dl class="schedule">
          <dt>Mardi - Vendredi</dt>
          <dd>10h - 13h / 14h - 19h</dd>
          <dt>Samedi</dt>
          <dd>10h - 18h</dd>
          <dt>Dimanche - Lundi</dt>
          <dd>Fermé</dd>
        </dl>
      </div>

      <div class="info-block">
        <h3>Contact</h3>
        <p>
          <a href="tel:0388512440">03 88 51 24 40</a><br />
          <a href="mailto:strasbourg@lalunetterieducoin.fr"> strasbourg@lalunetterieducoin.fr </a>
        </p>
      </div>

      <div class="info-block">
        <h3>Accès</h3>
        <p>
          Tram A, D - Arrêt Langstross Grand'Rue<br />
          Parking public à proximité
        </p>
      </div>

      <!-- Carte Google Maps -->
      <div class="map-embed">
        <iframe src="..." title="Plan d'accès"></iframe>
      </div>
    </div>
  </div>
</section>
```

---

## 📐 COMPOSANTS DESIGN À CRÉER

### 1. Boutons

```css
/* Bouton primaire (orange) */
.btn-primary {
  background: var(--color-primary);
  color: var(--color-white);
  padding: 1rem 2rem;
  border-radius: 2px; /* Carré, minimal */
  font-weight: 500;
  transition: all 0.3s ease;
}
.btn-primary:hover {
  background: var(--color-accent-dark);
  transform: translateY(-2px);
}

/* Bouton outline (élégant) */
.btn-outline {
  border: 1.5px solid var(--color-charcoal);
  color: var(--color-charcoal);
  background: transparent;
  padding: 1rem 2rem;
  border-radius: 2px;
}
.btn-outline:hover {
  background: var(--color-charcoal);
  color: var(--color-cream);
}

/* Lien texte avec flèche */
.link-arrow {
  color: var(--color-primary);
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
.link-arrow:hover {
  gap: 0.75rem; /* Flèche se déplace */
}
```

### 2. Cartes minimalistes

```css
.card-minimal {
  background: var(--color-white);
  border: 1px solid var(--color-sand);
  padding: 2rem;
  transition: all 0.3s ease;
}
.card-minimal:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transform: translateY(-4px);
}
```

### 3. Séparateurs

```css
.section-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, var(--color-sand), transparent);
  margin: 6rem 0;
}
```

---

## 📸 BESOINS PHOTO/CONTENU

### Photos à prévoir :

1. **Portrait Romain** (professionnel, lumière naturelle)
2. **Boutique extérieur** (façade, enseigne)
3. **Boutique intérieur** (2-3 angles, présentoir montures)
4. **Atelier/restauration** (mains travaillant sur monture)
5. **Détails produits** (montures close-up, verres, lentilles)
6. **Ambiance** (client essayant lunettes, convivialité)

**Style photo** :

- Lumière naturelle, tons chauds
- Légère désaturation pour élégance
- Focus sur l'authenticité, pas de mise en scène excessive

### Contenu texte à rédiger :

- [ ] Bio Romain (200 mots)
- [ ] Histoire entreprise (300 mots)
- [ ] Description détaillée services (4x 150 mots)
- [ ] Explication programme recyclage (400 mots)
- [ ] FAQ (10 questions)
- [ ] 3-5 témoignages clients

---

## 🚀 PLAN DE MIGRATION

### Phase 1 : Design System (1-2 jours)

1. Mettre à jour `tailwind.config.ts` (nouvelle palette)
2. Mettre à jour `base.css` (typographie Cormorant)
3. Créer nouveaux composants boutons/cartes

### Phase 2 : Homepage Refonte (2-3 jours)

1. Hero minimaliste
2. Section "Notre Histoire"
3. Services refonte
4. Engagement écologique
5. Témoignages

### Phase 3 : Nouvelles Pages (2-3 jours)

1. Page "À propos"
2. Page "Services" détaillée
3. Amélioration Contact

### Phase 4 : Contenu & Photos (variable)

1. Shooting photo
2. Rédaction contenus
3. Optimisation SEO

---

## ✅ CHECKLIST LANCEMENT

- [ ] Nouveau design system appliqué
- [ ] Toutes sections homepage refaites
- [ ] Page "À propos" créée
- [ ] Page "Services" créée
- [ ] Photos professionnelles intégrées
- [ ] Contenus rédigés et optimisés SEO
- [ ] Tests accessibilité (a11y)
- [ ] Tests performance (Lighthouse)
- [ ] Tests mobiles (iPhone, Android)
- [ ] Validation client

---

## 💡 INSPIRATIONS VISUELLES

**Sites à étudier** :

- https://warbyparker.com (simplicité, storytelling)
- https://oliverpeoples.com (élégance, typographie)
- https://cuyana.com (minimalisme chic, palette neutre)
- https://kinfolk.com (éditorial, espacement généreux)

**Codes visuels du luxe accessible** :

- Beaucoup d'espace blanc (breathing room)
- Typographie grande et lisible
- Photos authentiques (pas de stock photos)
- Palette restreinte (2-3 couleurs max)
- Animations subtiles (pas de flash)
- Contenu informatif et storytelling

---

**Prochaines étapes** : Validation de cette proposition, puis implémentation phase par phase.

Qu'en pensez-vous ? Des ajustements à faire ?
