import type { JSX } from 'react';

import RevealText from './RevealText';

type Props = {
  title: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
};

/**
 * Affiche un texte avec animation mot à mot et styles alternés (thin / bold).
 */
/**
 * Composant React pour afficher un titre de section avec un effet de révélation mot par mot.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {string} props.title - Le texte du titre à afficher avec l'animation.
 * @param {string} [props.className] - Classe(s) CSS optionnelle(s) à appliquer au titre.
 * @param {React.ElementType} [props.as] - Le type de balise HTML à utiliser pour le titre (par défaut : 'h2').
 *
 * @returns {JSX.Element} Le composant de titre animé.
 *
 * @example
 * <SectionTitleReveal title="Bienvenue sur notre site" className="text-4xl" as="h1" />
 */
export default function SectionTitleReveal({ title, className = '', as: Tag = 'h2' }: Props) {
  return (
    <Tag className={className}>
      <RevealText
        text={title}
        splitBy="word"
        baseDelay={0.1}
        preserveWordSpacing={false} // ✅ plus d’espace entre les mots
        renderPart={(word, index = 0) => (
          <span className={index % 2 === 0 ? 'font-thin' : 'font-extrabold'}>{word}</span>
        )}
      />
    </Tag>
  );
}
