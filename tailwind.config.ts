import type { Config } from 'tailwindcss';

const withOpacity = (variableName: string) => {
  return ({ opacityValue }: { opacityValue?: string }) =>
    opacityValue !== undefined
      ? `rgba(var(${variableName}), ${opacityValue})`
      : `rgb(var(${variableName}))`;
};

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      // padding interne par défaut (fallback si on n'utilise pas .container-padding)
      padding: '1rem',
      screens: { '2xl': '1280px' },
    },
    extend: {
      /* ====== COLORS ====== */
      colors: {
        /* ===== PALETTE BICOLORE ===== */
        orange: withOpacity('--color-orange-rgb') as unknown as string,
        'mauve-dark': withOpacity('--color-mauve-dark-rgb') as unknown as string,
        'violet-light': withOpacity('--color-violet-light-rgb') as unknown as string,

        /* Aliases sémantiques */
        brand: withOpacity('--color-orange-rgb') as unknown as string,           // Orange = marque principale
        text: withOpacity('--color-mauve-dark-rgb') as unknown as string,        // Mauve foncé = texte
        'text-muted': withOpacity('--color-mauve-dark-rgb') as unknown as string, // Mauve foncé avec opacité
        surface: withOpacity('--color-violet-light-rgb') as unknown as string,   // Violet très clair = surfaces
        
        /* Aliases fonctionnels */
        primary: withOpacity('--color-mauve-dark-rgb') as unknown as string,     // Actions primaires (mauve foncé)
        accent: withOpacity('--color-violet-light-rgb') as unknown as string,    // Accents subtils (violet clair)
        background: withOpacity('--color-orange-rgb') as unknown as string,      // Fond principal
      },

      /* ====== TYPO ====== */
      fontFamily: {
        sans: ['"League Spartan"', 'sans-serif'],
        serif: ['"Imbue"', 'serif'],
      },
      fontSize: {
        /* ===== HIÉRARCHIE STANDARDISÉE ===== */
        // Titres - line-height serré pour impact
        'title-xl': ['clamp(3.5rem, 5vw, 15rem)', '1.0'],    // Hero principal
        'title-lg': ['clamp(2rem, 3vw, 10rem)', '1.1'],      // Sections principales  
        'title-md': ['clamp(1.5rem, 2.5vw, 5rem)', '1.2'],   // Sous-sections
        'title-sm': ['clamp(1.25rem, 2vw, 3.5rem)', '1.3'],  // Petits titres
        
        // Corps de texte - line-height optimisé pour lisibilité
        'body-lg': ['clamp(1.25rem, 1.5vw, 2.5rem)', '1.4'], // CTA, textes importants
        'body': ['clamp(1rem, 1.5vw, 3.5rem)', '1.5'],       // Corps principal
        'body-sm': ['clamp(0.9rem, 1.1vw, 2.5rem)', '1.4'],  // Textes secondaires
        
      },

      /* ====== LAYOUT ====== */
      screens: {
        '3xl': '1920px',
        '4xl': '2560px',
        '5xl': '3840px',
      },
      maxWidth: {
        content: '100%', // existant (ex: pages full-bleed)
        'content-readable': '72ch', // pour les articles/CGV/mentions
      },
      width: {
        'service-img': 'clamp(20rem, 25vw, 42rem)',
      },
      height: {
        card: 'clamp(32rem, 70vh, 90rem)',
      },

      /* ====== SPACING ====== */
      spacing: {
        /* ===== SYSTÈME SÉMANTIQUE ===== */
        // Espacement vertical standardisé
        'xs': '0.5rem',    // 8px - Éléments très proches
        'sm': '1rem',      // 16px - Paragraphes, listes
        'md': '2rem',      // 32px - Sections de contenu  
        'lg': '4rem',      // 64px - Grandes sections
        'xl': '6rem',      // 96px - Sections majeures

        /* ===== ESPACEMENT SPÉCIALISÉ ===== */
        // Sections principales (responsive)
        section: 'clamp(6rem, 10vw, 10rem)',           // Entre sections page
        'section-sm': 'clamp(4rem, 8vw, 8rem)',        // Sections réduites
        
        // Gaps internes (responsive) 
        'section-gap': 'clamp(1rem, 5vw, 3rem)',       // ≈ md-lg responsive
        'title-gap': 'clamp(2rem, 2.5vw, 4rem)',       // ≈ md-lg responsive
        'flow': 'clamp(0.75rem, 2vw, 1.5rem)',         // ≈ xs-sm responsive
        
        // Composants
        'btn-x': 'clamp(1.5rem, 2vw, 3rem)',           // Padding horizontal boutons
        'btn-y': 'clamp(1.25rem, 1vw, 2.5rem)',        // Padding vertical boutons
        'word-gap': 'clamp(1rem, 1.5vw, 2rem)',        // Gap entre mots
        
        // Containers
        'container-x': 'clamp(1rem, 5vw, 3rem)',       // Padding horizontal
        'container-y': 'clamp(2rem, 5vw, 4rem)',       // Padding vertical
      },

      /* ====== RADII / SHADOWS / Z ====== */
      borderRadius: {
        btn: '0.8rem',
        card: '1.5rem',
        // alias
        sm: '0.5rem',
        lg: '1rem',
      },
      boxShadow: {
        card: '0 4px 8px rgba(0, 0, 0, 0.05)',
        soft: '0 2px 4px rgba(0, 0, 0, 0.03)',
        // alias
        focus: '0 0 0 3px rgba(204, 252, 211, 0.6)',
      },
      zIndex: {
        base: '10',
        menu: '50',
        modal: '100',
        overlay: '200',
      },

      /* ====== MOTION ====== */
      transitionDuration: {
        250: '250ms',
      },
    },
  },
  // Variants utilitaires utiles pour motion-safe/reduce déjà fournis par Tailwind
  // rien à ajouter ici
};

export default config;