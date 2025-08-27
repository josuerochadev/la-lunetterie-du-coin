import { useRef, useEffect } from 'react';

/**
 * Hook React pour appliquer un effet de tilt 3D à un élément div.
 *
 * Ce hook retourne une référence (`ref`) à attacher à un élément HTMLDivElement.
 * Lorsque la souris se déplace sur l'élément, celui-ci s'incline en fonction de la position du curseur,
 * créant un effet de perspective 3D interactif. L'inclinaison maximale et la transition peuvent être personnalisées.
 *
 * @param maxTilt - Inclinaison maximale en degrés (par défaut : 7).
 * @param transition - Propriété CSS de transition appliquée à la transformation (par défaut : 'transform 0.25s ease-out').
 * @returns Une référence React à attacher à l'élément cible.
 *
 * @example
 * const tiltRef = use3DTilt(10, 'transform 0.3s cubic-bezier(.03,.98,.52,.99)');
 * return <div ref={tiltRef}>Carte avec effet 3D</div>;
 */
export function use3DTilt(maxTilt = 5, transition = 'transform 0.2s ease-out') {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = ref.current;
    if (!card) return;

    card.style.transition = transition;
    let isInteracting = false;

    const handleMouseMove = (e: MouseEvent) => {
      // Éviter les transformations pendant les clics ou interactions
      if (e.buttons > 0 || isInteracting) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const percentX = (x - centerX) / centerX;
      const percentY = -((y - centerY) / centerY);

      // Débounce pour éviter les transformations trop fréquentes
      requestAnimationFrame(() => {
        if (!isInteracting) {
          card.style.transform = `perspective(1000px) rotateY(${percentX * maxTilt}deg) rotateX(${percentY * maxTilt}deg)`;
        }
      });
    };

    const handleMouseLeave = () => {
      isInteracting = false;
      card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
    };

    const handleMouseDown = () => {
      isInteracting = true;
      card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
    };

    const handleMouseUp = () => {
      // Délai plus long pour s'assurer que le clic se propage
      setTimeout(() => {
        isInteracting = false;
      }, 150);
    };

    const handleClick = () => {
      // S'assurer que l'interaction est bien prise en compte
      isInteracting = true;
      setTimeout(() => {
        isInteracting = false;
      }, 200);
    };

    const handleTouchStart = () => {
      isInteracting = true;
      card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
    };

    const handleTouchEnd = () => {
      setTimeout(() => {
        isInteracting = false;
      }, 150);
    };

    card.addEventListener('mousemove', handleMouseMove, { passive: true });
    card.addEventListener('mouseleave', handleMouseLeave);
    card.addEventListener('mousedown', handleMouseDown);
    card.addEventListener('mouseup', handleMouseUp);
    card.addEventListener('click', handleClick);
    card.addEventListener('touchstart', handleTouchStart, { passive: true });
    card.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
      card.removeEventListener('mousedown', handleMouseDown);
      card.removeEventListener('mouseup', handleMouseUp);
      card.removeEventListener('click', handleClick);
      card.removeEventListener('touchstart', handleTouchStart);
      card.removeEventListener('touchend', handleTouchEnd);
    };
  }, [maxTilt, transition]);

  return ref;
}
