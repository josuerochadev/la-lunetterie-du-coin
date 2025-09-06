import { cn } from '@/lib/cn';

type Service = {
  title: string;
  description: string;
  /** Optionnel si un jour tu veux y (ré)intégrer une image responsive */
  imageBase?: string;
};

type ServiceCardProps = {
  service: Service;
  className?: string;
};

/**
 * Composant React pour afficher une carte de service avec un effet de tilt et une animation.
 *
 * @param {ServiceCardProps} props - Les propriétés du composant.
 * @param {object} props.service - L'objet représentant le service à afficher.
 * @param {string} props.service.title - Le titre du service.
 * @param {string} props.service.description - La description du service.
 * @param {string} [props.className] - Classe(s) CSS supplémentaire(s) à appliquer à la carte.
 *
 * @returns {JSX.Element} Une carte stylisée présentant le service, avec animation et accessibilité.
 */

export default function ServiceCard({ service, className }: ServiceCardProps) {
  return (
    <section
      role="tabpanel"
      id={`tabpanel-${service.title.replace(/\s+/g, '-').toLowerCase()}`}
      className={cn(
        'simple-hover-scale group relative flex w-[clamp(18rem,42vw,120rem)] flex-col self-center rounded-card bg-primary/30 p-section-gap text-accent shadow-card backdrop-blur-2xl',
        className,
      )}
      aria-labelledby={`service-title-${service.title.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <h3
        id={`service-title-${service.title.replace(/\s+/g, '-').toLowerCase()}`}
        className="mb-4 text-left font-serif text-title-lg font-bold text-accent transition-colors duration-200 group-hover:text-accent"
      >
        {service.title}
      </h3>

      <p className="text-body leading-relaxed tracking-wide text-accent/90">
        {service.description}
      </p>
    </section>
  );
}
