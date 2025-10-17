// src/components/common/PageHeader.tsx
import { Link } from 'react-router-dom';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';

type Props = { title: string; backTo?: string };

export default function PageHeader({ title, backTo = '/' }: Props) {
  return (
    <header className="mb-title-gap text-center">
      <SimpleAnimation type="slide-down">
        <h1 className="heading-page mb-title-gap pt-lg">{title}</h1>
      </SimpleAnimation>
      <nav aria-label="Fil d'Ariane" className="mt-8">
        <Link
          to={backTo}
          className="focus-style inline-flex items-center underline-offset-8 transition-all duration-300 hover:underline"
          aria-label="Revenir à la page d'accueil"
        >
          ← Retour à l'accueil
        </Link>
      </nav>
    </header>
  );
}
