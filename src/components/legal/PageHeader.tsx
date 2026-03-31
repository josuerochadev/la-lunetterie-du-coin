// src/components/common/PageHeader.tsx
import { Link } from 'react-router-dom';

import TextReveal from '@/components/motion/TextReveal';

type Props = { title: string; backTo?: string; backLabel?: string };

export default function PageHeader({ title, backTo = '/', backLabel = 'Accueil' }: Props) {
  return (
    <header className="mb-title-gap text-center">
      <TextReveal as="h1" className="heading-page mb-title-gap pt-lg">
        {title}
      </TextReveal>
      <nav aria-label="Fil d'Ariane" className="mt-8">
        <ol className="inline-flex items-center gap-2 text-body-sm text-black">
          <li>
            <Link
              to="/"
              className="focus-style transition-colors duration-300 hover:text-secondary-orange"
            >
              Accueil
            </Link>
          </li>
          {backTo !== '/' && (
            <>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  to={backTo}
                  className="focus-style transition-colors duration-300 hover:text-secondary-orange"
                >
                  {backLabel}
                </Link>
              </li>
            </>
          )}
          <li aria-hidden="true">/</li>
          <li>
            <span className="font-medium text-black" aria-current="page">
              {title}
            </span>
          </li>
        </ol>
      </nav>
    </header>
  );
}
