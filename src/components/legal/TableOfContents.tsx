import type { MouseEvent } from 'react';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';

type TableOfContentsProps = {
  sections: Array<{
    id: string;
    title: string;
  }>;
};

export default function TableOfContents({ sections }: TableOfContentsProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      element.focus({ preventScroll: true });
    }
  };

  return (
    <SimpleAnimation type="fade" delay={0}>
      <nav aria-label="Table des matières" className="pb-12">
        <h2 className="text-subtitle mb-6 text-body-sm text-black">Sommaire</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {sections.map((section, index) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                onClick={(e) => handleClick(e, section.id)}
                className="group inline-flex items-baseline gap-3 text-body text-black transition-colors hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <span className="text-body-sm text-black transition-colors group-hover:text-secondary-orange print:text-black">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="transition-colors">{section.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </SimpleAnimation>
  );
}
