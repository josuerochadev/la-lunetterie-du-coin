// SectionTitle.tsx

import { OptimizedAnimateItem } from '@/components/motion/OptimizedAnimateItem';

type SectionTitleProps = {
  title: string;
};

/**
 * Composant fonctionnel qui affiche un titre de section stylisé avec animation smooth.
 *
 * @param {SectionTitleProps} props - Les propriétés du composant.
 * @param {string} props.title - Le texte du titre à afficher.
 * @returns {JSX.Element} Élément JSX représentant le titre de la section avec slide-down élégant.
 */
const SectionTitle = ({ title }: SectionTitleProps) => {
  return (
    <OptimizedAnimateItem type="slide-down" threshold={0.35}>
      <h2 className="mb-title-gap pt-lg text-title-xl uppercase">{title}</h2>
    </OptimizedAnimateItem>
  );
};

export default SectionTitle;
