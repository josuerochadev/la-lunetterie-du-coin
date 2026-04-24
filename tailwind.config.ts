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
        /* ===== PALETTE REBRANDING 2026 ===== */
        black: withOpacity('--color-black-rgb') as unknown as string,
        white: withOpacity('--color-white-rgb') as unknown as string,
        yellow: withOpacity('--color-yellow-rgb') as unknown as string,
        green: withOpacity('--color-green-rgb') as unknown as string,
        blue: withOpacity('--color-blue-rgb') as unknown as string,
        stone: withOpacity('--color-stone-rgb') as unknown as string,
        orange: withOpacity('--color-orange-rgb') as unknown as string,

        /* Aliases sémantiques */
        brand: withOpacity('--color-black-rgb') as unknown as string,
        accent: withOpacity('--color-yellow-rgb') as unknown as string,
        text: withOpacity('--color-black-rgb') as unknown as string,
        surface: withOpacity('--color-white-rgb') as unknown as string,
        background: withOpacity('--color-white-rgb') as unknown as string,
        primary: withOpacity('--color-black-rgb') as unknown as string,

        /* Aliases secondaires */
        'secondary-green': withOpacity('--color-green-rgb') as unknown as string,
        'secondary-blue': withOpacity('--color-blue-rgb') as unknown as string,
        'secondary-stone': withOpacity('--color-stone-rgb') as unknown as string,
        'secondary-orange': withOpacity('--color-orange-rgb') as unknown as string,
      },

      /* ====== TYPO ====== */
      fontFamily: {
        display: ['"Please"', 'system-ui', 'sans-serif'], // Titres (Please Heavy)
        body: ['"Satoshi"', 'system-ui', 'sans-serif'], // Corps de texte
        sans: ['"Satoshi"', 'system-ui', 'sans-serif'], // Default
      },
      fontSize: {
        /* ===== HIERARCHIE STANDARDISEE =====
         *
         * Toutes les clamps sont calibrées sur deux points d'ancrage :
         *   - min (anchor mobile) = taille cible à 375px (iPhone SE)
         *   - max (anchor 4K)     = plafond bold maximaliste
         *   - préféré linéaire    = a*rem + b*vw, calibré pour atteindre la
         *                           valeur cible à 1920px (FHD) sans plateau.
         *
         * Hiérarchie stricte garantie à toutes les tailles d'écran :
         *   title-xl > title-lg > title-md > title-sm
         *     > body-xl > body-lg > body > body-sm > body-xs
         *
         * Repères (px) : 375 / 768 / 1280 / 1920 / 2560
         *   title-xl : 56  /  77 / 105 / 140 / 175
         *   title-lg : 44  /  58 /  77 / 100 / 123
         *   title-md : 32  /  43 /  58 /  76 /  94
         *   title-sm : 24  /  31 /  39 /  50 /  61
         *   body-xl  : 24  /  27 /  30 /  34 /  36
         *   body-lg  : 20  /  22 /  25 /  28 /  30
         *   body     : 17  /  19 /  21 /  24 /  26
         *   body-sm  : 15  /  16 /  17 /  18 /  19
         *   body-xs  : 13  /  14 /  15 /  15 /  16
         */

        // Titres - line-height serré pour impact (charte 0.9)
        'title-xl': ['clamp(3.5rem, 2.2rem + 5.45vw, 15rem)', '0.9'],
        'title-lg': ['clamp(2.75rem, 1.9rem + 3.63vw, 10rem)', '0.9'],
        'title-md': ['clamp(2rem, 1.33rem + 2.85vw, 7.5rem)', '0.9'],
        'title-sm': ['clamp(1.5rem, 1.1rem + 1.68vw, 5rem)', '0.9'],

        // Corps de texte - line-height 1.3
        // Plafonds réduits vs titres pour lisibilité laptop/tablette
        'body-xl': ['clamp(1.5rem, 1.35rem + 0.55vw, 2.25rem)', '1.3'],
        'body-lg': ['clamp(1.25rem, 1.13rem + 0.46vw, 1.875rem)', '1.3'],
        body: ['clamp(1.0625rem, 0.96rem + 0.39vw, 1.625rem)', '1.3'],
        'body-sm': ['clamp(0.9375rem, 0.89rem + 0.18vw, 1.1875rem)', '1.3'],
        'body-xs': ['clamp(0.8125rem, 0.78rem + 0.13vw, 1rem)', '1.3'],
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
        container: 'min(98vw, 3600px)', // Layout fluide : 98% de la largeur, max 3600px
      },
      height: {
        card: 'clamp(32rem, 70vh, 90rem)',
      },

      /* ====== SPACING ====== */
      spacing: {
        /* ===== SYSTEME SEMANTIQUE ===== */
        // Espacement vertical standardisé
        xs: '0.5rem', // 8px - Éléments très proches
        sm: '1rem', // 16px - Paragraphes, listes
        md: '2rem', // 32px - Sections de contenu
        lg: '4rem', // 64px - Grandes sections
        xl: '6rem', // 96px - Sections majeures

        /* ===== ESPACEMENT SPECIALISE ===== */
        // Sections principales (responsive)
        section: 'clamp(6rem, 10vw, 10rem)', // Entre sections page
        'section-sm': 'clamp(4rem, 8vw, 8rem)', // Sections réduites

        // Gaps internes (responsive)
        'section-gap': 'clamp(1rem, 5vw, 3rem)', // ≈ md-lg responsive
        'title-gap': 'clamp(2rem, 2.5vw, 4rem)', // ≈ md-lg responsive
        flow: 'clamp(0.75rem, 2vw, 1.5rem)', // ≈ xs-sm responsive

        // Containers
        'container-x': 'clamp(1rem, 5vw, 3rem)', // Padding horizontal
        'container-y': 'clamp(2rem, 5vw, 4rem)', // Padding vertical
      },

      /* ====== RADII / SHADOWS / Z ====== */
      borderRadius: {
        card: '1.5rem',
        sm: '0.5rem',
        lg: '1rem',
      },
      boxShadow: {
        card: '0 4px 8px rgba(0, 0, 0, 0.05)',
      },
      zIndex: {
        base: '10',
        navbar: '40',
        menu: '50',
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
