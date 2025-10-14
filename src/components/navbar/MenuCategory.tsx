import type React from 'react';
import { Link } from 'react-router-dom';

import MenuLinkItem from './MenuLinkItem';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';

type MenuCategoryProps = {
  title: string;
  titleHref?: string; // Lien optionnel sur le titre
  links: Array<{
    label: string;
    href: string;
    featured?: boolean;
  }>;
  onLinkClick: () => void;
  animationDelay: number;
};

/**
 * Composant MenuCategory
 *
 * Affiche une catégorie de navigation dans le menu plein écran.
 * Design éditorial avec titre de catégorie (optionnellement cliquable) et liens organisés.
 *
 * @param title - Titre de la catégorie (ex: "DÉCOUVRIR", "CONTACT")
 * @param titleHref - Lien optionnel pour rendre le titre cliquable
 * @param links - Liste des liens de la catégorie
 * @param onLinkClick - Callback pour fermer le menu lors du clic
 * @param animationDelay - Délai d'animation stagger (ms)
 */
const MenuCategory: React.FC<MenuCategoryProps> = ({
  title,
  titleHref,
  links,
  onLinkClick,
  animationDelay,
}) => {
  return (
    <SimpleAnimation type="slide-up" delay={animationDelay} immediate={true}>
      <div className="space-y-4">
        {/* Titre de la catégorie */}
        {titleHref ? (
          <Link
            to={titleHref}
            onClick={onLinkClick}
            className="group inline-block text-body-sm font-semibold uppercase tracking-wide text-stone transition-colors hover:text-orange"
          >
            {title}
            <span
              className="ml-2 inline-block transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          </Link>
        ) : (
          <h3 className="text-body-sm font-semibold uppercase tracking-wide text-stone">{title}</h3>
        )}

        {/* Liste des liens */}
        {links.length > 0 && (
          <ul className="space-y-3">
            {links.map((link) => (
              <li key={link.href}>
                <MenuLinkItem
                  label={link.label}
                  href={link.href}
                  onClick={onLinkClick}
                  featured={link.featured}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </SimpleAnimation>
  );
};

export default MenuCategory;
