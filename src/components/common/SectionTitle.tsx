// SectionTitle.tsx

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';

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
    <SimpleAnimation type="slide-down">
      <h2 className="mb-title-gap pt-lg text-title-xl uppercase">{title}</h2>
    </SimpleAnimation>
  );
};

export default SectionTitle;
