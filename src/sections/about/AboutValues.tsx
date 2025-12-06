import Heart from 'lucide-react/dist/esm/icons/heart';
import Leaf from 'lucide-react/dist/esm/icons/leaf';
import Award from 'lucide-react/dist/esm/icons/award';

import { VALUES_DATA } from '@/data/about';
import { SimpleAnimation } from '@/components/motion/SimpleAnimation';

/**
 * Mapping des noms d'icônes vers les composants Lucide
 */
const iconMap = {
  heart: Heart,
  leaf: Leaf,
  award: Award,
} as const;

/**
 * Section Valeurs de la page À propos
 *
 * Grid de 3 colonnes affichant les valeurs fondamentales
 * avec icônes, titres et descriptions.
 *
 * @component
 * @returns {JSX.Element} Valeurs section
 */
export default function AboutValues() {
  return (
    <section id="valeurs" className="relative w-full bg-background py-section">
      <div className="mx-auto max-w-container px-container-x">
        <SimpleAnimation type="slide-up" delay={0}>
          <div className="mb-12 text-center">
            <span className="mb-4 inline-block text-body-sm font-medium uppercase tracking-wider text-stone">
              Nos engagements
            </span>
            <h2 className="heading-section">Une lunetterie au coin qu'apporte du cœur</h2>
          </div>
        </SimpleAnimation>

        <div className="grid gap-12 md:grid-cols-3 lg:gap-16">
          {VALUES_DATA.map((value) => {
            const Icon = iconMap[value.iconName];
            return (
              <SimpleAnimation key={value.title} type="slide-up" delay={0}>
                <div className="space-y-4 border-t border-stone/20 pt-6">
                  <Icon className="h-8 w-8 text-accent" strokeWidth={1.5} aria-hidden="true" />
                  <h3 className="heading-subsection">{value.title}</h3>
                  <p className="text-body leading-relaxed text-stone">{value.description}</p>
                </div>
              </SimpleAnimation>
            );
          })}
        </div>
      </div>
    </section>
  );
}
