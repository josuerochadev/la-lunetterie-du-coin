import type { MouseEvent } from 'react';

import AnimatedItem from '@/components/motion/AnimatedItem';
import { fadeInUp } from '@/components/motion/variants/fade';

type TableOfContentsProps = {
  sections: Array<{
    id: string;
    title: string;
  }>;
  className?: string;
};

/**
 * Table des matières interactive pour les pages légales
 *
 * Génère une navigation interne avec ancres vers les sections
 * du document pour améliorer l'accessibilité et l'expérience utilisateur.
 *
 * @component
 * @param {TableOfContentsProps} props - Les propriétés du composant
 * @returns {JSX.Element} Navigation sous forme de table des matières
 */
export default function TableOfContents({ sections, className = '' }: TableOfContentsProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      // Focus management for accessibility
      element.focus({ preventScroll: true });
    }
  };

  return (
    <AnimatedItem index={2} variant={fadeInUp}>
      <nav aria-label="Table des matières" className={`mb-20 ${className}`}>
        <AnimatedItem index={2.2} variant={fadeInUp}>
          <h2 className="mb-8 font-serif text-title-lg font-bold text-primary">Sommaire</h2>
        </AnimatedItem>
        <ul className="space-y-6">
          {sections.map((section, index) => (
            <AnimatedItem key={section.id} index={2.4 + index * 0.1} variant={fadeInUp}>
              <li>
                <a
                  href={`#${section.id}`}
                  onClick={(e) => handleClick(e, section.id)}
                  className="focus-style group flex items-baseline gap-sm text-primary transition-all duration-200 focus:outline-none"
                >
                  <span className="min-w-[2rem] text-title-sm font-thin">{index + 1}.</span>
                  <span className="flex flex-wrap gap-x-1">
                    <span className="font-serif text-title-sm font-bold tracking-wider transition-all duration-200 group-hover:tracking-widest">
                      {section.title}
                    </span>
                  </span>
                </a>
              </li>
            </AnimatedItem>
          ))}
        </ul>
      </nav>
    </AnimatedItem>
  );
}
