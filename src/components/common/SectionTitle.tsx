// SectionTitle.tsx

import SectionTitleReveal from '../motion/text/SectionTitleReveal';

type SectionTitleProps = {
  title: string;
};

/**
 * Affiche un titre stylisé avec une animation word-by-word.
 */
/**
 * Composant fonctionnel qui affiche un titre de section stylisé.
 *
 * @param {SectionTitleProps} props - Les propriétés du composant.
 * @param {string} props.title - Le texte du titre à afficher.
 * @returns {JSX.Element} Élément JSX représentant le titre de la section avec animation de révélation.
 */
const SectionTitle = ({ title }: SectionTitleProps) => {
  return (
    <SectionTitleReveal
      as="h2"
      className="mb-title-gap pt-lg text-title-xl uppercase"
      title={title}
    />
  );
};

export default SectionTitle;
