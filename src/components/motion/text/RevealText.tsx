import { m } from 'framer-motion';
import { useMemo } from 'react';
import type { JSX } from 'react';

type Props = {
  text: string;
  delay?: number;
  baseDelay?: number;
  className?: string;
  splitBy?: 'word' | 'letter';
  preserveWordSpacing?: boolean;
  // eslint-disable-next-line no-unused-vars
  renderPart?: (part: string, index: number) => JSX.Element;
};

/**
 * Composant React pour révéler du texte avec une animation de type "stagger" (décalage progressif).
 *
 * @param text Le texte à afficher et à animer.
 * @param delay (optionnel) Délai initial avant le début de l'animation (en secondes).
 * @param baseDelay (optionnel) Délai entre chaque partie animée (en secondes, par défaut 0.06).
 * @param className (optionnel) Classe CSS à appliquer au conteneur principal.
 * @param splitBy (optionnel) Méthode de découpage du texte : 'word' (mot) ou 'letter' (lettre). Par défaut 'word'.
 * @param preserveWordSpacing (optionnel) Si vrai, conserve l'espacement entre les mots lors du découpage par mot.
 * @param renderPart (optionnel) Fonction de rendu personnalisée pour chaque partie (mot ou lettre) du texte.
 *
 * @returns Un composant React qui affiche le texte avec une animation de révélation progressive.
 */
export default function RevealText({
  text,
  delay = 0,
  baseDelay = 0.06,
  className = '',
  splitBy = 'word',
  preserveWordSpacing = true,
  renderPart,
}: Props) {
  const parts = useMemo(() => {
    if (typeof text !== 'string') return [];
    return splitBy === 'letter' ? text.split('') : text.split(' ');
  }, [text, splitBy]);

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: baseDelay,
        delayChildren: delay,
      },
    },
  };

  const child = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  return (
    <m.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={container}
      className={className}
    >
      {parts.map((part, i) => {
        // Generate a unique key using the part and its position in the string
        const key =
          splitBy === 'letter'
            ? `${part}-${text.indexOf(part, i)}`
            : `${part}-${
                text
                  .split(' ')
                  .slice(0, i + 1)
                  .join(' ').length
              }`;
        return (
          <m.span
            key={key}
            variants={child}
            className={
              splitBy === 'word' && preserveWordSpacing ? 'mr-[0.4em] inline-block' : 'inline-block'
            }
          >
            {renderPart ? renderPart(part, i) : part}
          </m.span>
        );
      })}
    </m.div>
  );
}
