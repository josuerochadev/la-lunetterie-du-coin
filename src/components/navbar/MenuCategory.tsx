import type React from 'react';

import MenuLinkItem from './MenuLinkItem';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';

type MenuCategoryProps = {
  title: string;
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
 * Design éditorial avec titre de catégorie et liens organisés.
 *
 * @param title - Titre de la catégorie (ex: "DÉCOUVRIR", "CONTACT")
 * @param links - Liste des liens de la catégorie
 * @param onLinkClick - Callback pour fermer le menu lors du clic
 * @param animationDelay - Délai d'animation stagger (ms)
 */
const MenuCategory: React.FC<MenuCategoryProps> = ({
  title,
  links,
  onLinkClick,
  animationDelay,
}) => {
  return (
    <SimpleAnimation type="fade" delay={animationDelay} immediate={true}>
      <div className="space-y-4">
        {/* Titre de la catégorie */}
        <h3 className="text-body-sm font-bold uppercase tracking-wide text-stone">{title}</h3>

        {/* Liste des liens */}
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
      </div>
    </SimpleAnimation>
  );
};

export default MenuCategory;
