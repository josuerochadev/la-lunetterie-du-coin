import Star from 'lucide-react/dist/esm/icons/star';

/**
 * Props du composant RatingStars
 */
interface RatingStarsProps {
  /**
   * Note sur 5 (entre 0 et 5)
   */
  rating: number;
  /**
   * Taille des étoiles (Tailwind classes)
   * @default 'h-5 w-5'
   */
  size?: string;
  /**
   * Classes CSS supplémentaires pour le conteneur
   */
  className?: string;
}

/**
 * Composant RatingStars
 *
 * Affiche une note sous forme d'étoiles (1-5).
 * Les étoiles pleines sont colorées en accent, les étoiles vides en gris clair.
 *
 * Utilisé dans :
 * - Testimonials section (avis clients Google Reviews)
 *
 * Accessible avec aria-label pour les lecteurs d'écran.
 *
 * @component
 * @example
 * <RatingStars rating={5} />
 * <RatingStars rating={4} size="h-6 w-6" />
 */
export function RatingStars({ rating, size = 'h-5 w-5', className = '' }: RatingStarsProps) {
  // Clamp rating entre 0 et 5 pour éviter erreurs
  const clampedRating = Math.max(0, Math.min(5, rating));

  return (
    <div
      className={`flex gap-1 ${className}`}
      role="img"
      aria-label={`Note: ${clampedRating} sur 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${size} ${i < clampedRating ? 'fill-accent text-accent' : 'text-black'}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
