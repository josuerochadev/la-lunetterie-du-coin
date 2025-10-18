import { useState, useEffect } from 'react';
import ArrowUp from 'lucide-react/dist/esm/icons/arrow-up';

import { useMotionPreference } from '@/a11y/useMotionPreference';

/**
 * Composant ScrollToTopButton
 *
 * Bouton qui apparaît après un certain scroll pour remonter en haut de la page.
 *
 * Fonctionnalités :
 * - Apparaît après 400px de scroll
 * - Animation fade in/out
 * - Respecte les préférences de mouvement
 * - Position fixe en bas à droite
 * - Accessible avec aria-label
 *
 * @component
 */
export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const prm = useMotionPreference();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: prm ? 'auto' : 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 border border-charcoal bg-gradient-to-b from-cream/40 via-cream/25 via-50% to-cream/10 px-4 py-3 text-body-sm font-medium text-charcoal shadow-lg backdrop-blur-2xl transition-all duration-300 hover:text-orange focus-visible:text-orange ${
        isVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-16 opacity-0'
      }`}
      aria-label="Remonter en haut de la page"
      type="button"
    >
      <ArrowUp className="h-4 w-4" aria-hidden="true" />
      <span className="hidden sm:inline">Retour en haut</span>
    </button>
  );
}
