// src/components/common/Background.tsx
import { memo, useEffect, useState } from 'react';

import { RippleAnimation } from './RippleAnimation';

import { useSmoothedScrollProgress } from '@/hooks/useSmoothedScrollProgress';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * Affiche le fond animé avec effets de halo et ondulations circulaires.
 * À positionner au plus bas niveau du layout pour éviter tout effet sur l'interaction.
 */
/**
 * Composant d'arrière-plan pour l'application.
 *
 * Ce composant affiche un halo doux en bas à droite de l'écran ainsi qu'une animation
 * d’ondulations concentriques synchronisée avec la progression du défilement.
 * Les éléments sont positionnés en arrière-plan et n'interfèrent pas avec les interactions utilisateur.
 *
 * @component
 *
 * @returns {JSX.Element} Élément JSX représentant l'arrière-plan animé.
 */
const Background = memo(function Background() {
  const prm = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Monte après la 1re peinture / quand le thread est calme
    const cb = () => setMounted(true);
    if ('requestIdleCallback' in window) {
      const id = (window as Window & typeof globalThis).requestIdleCallback(cb, { timeout: 1500 });
      return () => (window as Window & typeof globalThis).cancelIdleCallback?.(id);
    }
    // fallback
    const t = setTimeout(cb, 0);
    return () => clearTimeout(t);
  }, []);

  const scrollProgress = useSmoothedScrollProgress();

  // Rien du tout si PRM
  if (prm) return null;
  // Différer l’arrière-plan pour ne pas impacter le LCP
  if (!mounted) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[rgb(var(--color-orange-rgb))]" />

      <div className="absolute inset-0 bg-[radial-gradient(1000px_700px_at_80%_20%,rgba(0,0,0,0.10),transparent_60%)]" />
      <div className="absolute bottom-[10%] right-[15%] z-base h-[400px] w-[400px] rounded-full bg-accent opacity-10 blur-[100px]" />
      <RippleAnimation className="z-0" scrollProgress={scrollProgress} />
    </div>
  );
});

export default Background;
