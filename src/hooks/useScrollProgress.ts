import { useEffect, useState } from 'react';

/**
 * Hook React permettant de suivre la progression du défilement vertical de la page.
 *
 * Ce hook retourne une valeur comprise entre 0 et 1 représentant le pourcentage de la page
 * actuellement parcouru par l'utilisateur lors du scroll.
 *
 * @returns {number} progress - La progression du scroll, où 0 signifie le haut de la page et 1 le bas.
 *
 * @example
 * const progress = useScrollProgress();
 * // Utilisez `progress` pour afficher une barre de progression de scroll, par exemple.
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const newProgress = Math.min(1, scrollY / maxScroll);
      setProgress(newProgress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
}
