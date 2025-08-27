// src/components/motion/SplitText.tsx
import type { JSX } from 'react';

import RevealText from './RevealText';

type Props = {
  text: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  /** true = rendu immédiat (ne bloque pas LCP), pas de reveal mot à mot */
  priority?: boolean;
};

/**
 * Composant React pour afficher un texte avec une animation de révélation mot par mot.
 *
 * @param text - Le texte à afficher et à animer.
 * @param className - (Optionnel) Classe(s) CSS supplémentaire(s) à appliquer au conteneur.
 *
 * Ce composant utilise `RevealText` pour animer chaque mot du texte séparément,
 * tout en préservant l'espacement entre les mots.
 * Chaque mot est encapsulé dans une balise `<span>` avec la classe `inline-block`.
 */
export default function SplitText({ text, className = '', as, priority = false }: Props) {
  if (priority) {
    // Rendu direct sans animation (pro-LCP)
    const Tag = (as ?? 'p') as keyof JSX.IntrinsicElements;
    return <Tag className={className}>{text}</Tag>;
  }
  return (
    <RevealText
      text={text}
      splitBy="word"
      className={className}
      baseDelay={0.1}
      preserveWordSpacing={true}
      renderPart={(word) => <span className="inline-block">{word}</span>}
    />
  );
}
