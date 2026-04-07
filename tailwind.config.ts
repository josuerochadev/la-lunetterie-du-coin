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
        /* ===== HIERARCHIE STANDARDISEE ===== */
        // Titres - line-height serré pour impact (charte 0.9)
        'title-xl': ['clamp(3.5rem, 5vw, 15rem)', '0.9'],
        'title-lg': ['clamp(2.75rem, 3vw, 10rem)', '0.9'],
        'title-md': ['clamp(2rem, 2.5vw, 5rem)', '0.9'],
        'title-sm': ['clamp(1.5rem, 2vw, 3.5rem)', '0.9'],

        // Corps de texte - line-height 1.3
        'body-xl': ['clamp(1.5rem, 2.4vw, 3rem)', '1.3'],
        'body-lg': ['clamp(1.25rem, 2vw, 2.5rem)', '1.3'],
        body: ['clamp(1rem, 1.8vw, 3.5rem)', '1.3'],
        'body-sm': ['clamp(0.9rem, 1.4vw, 2.5rem)', '1.3'],
        'body-xs': ['clamp(0.75rem, 1.2vw, 1.75rem)', '1.3'],
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
