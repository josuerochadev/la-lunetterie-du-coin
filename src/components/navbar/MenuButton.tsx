import { forwardRef } from 'react';

import { fadeInDown } from '@/components/motion/variants/fade';
import AnimatedItem from '@/components/motion/AnimatedItem';

type MenuButtonProps = {
  isOpen: boolean;
  onClick: () => void;
  id?: string;
};

/**
 * MenuButton est un composant React permettant d'afficher un bouton pour ouvrir ou fermer le menu principal.
 *
 * @component
 * @param {MenuButtonProps} props - Les propriétés du composant.
 * @param {boolean} props.isOpen - Indique si le menu est actuellement ouvert.
 * @param {() => void} props.onClick - Fonction appelée lors du clic sur le bouton.
 * @param {string} [props.id='menu-toggle'] - Identifiant unique pour le bouton (optionnel).
 * @param {React.Ref<HTMLButtonElement>} ref - Référence vers l'élément bouton.
 *
 * @returns {JSX.Element} Un bouton animé permettant d'ouvrir ou de fermer le menu principal.
 *
 * @example
 * <MenuButton isOpen={menuOuvert} onClick={gererClicMenu} />
 */
const MenuButton = forwardRef<HTMLButtonElement, MenuButtonProps>(
  ({ isOpen, onClick, id = 'menu-toggle' }, ref) => {
    return (
      <div className="fixed left-0 right-0 z-overlay flex justify-start px-container-x py-section-gap sm:justify-center">
        <AnimatedItem variant={fadeInDown} duration={0.6} viewport={{ once: true }}>
          <button
            ref={ref}
            type="button"
            id={id}
            onClick={onClick}
            aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isOpen}
            aria-controls="main-menu"
            className="menu-toggle-button focus-style hover:font-bold px-0 sm:px-4"
            data-state={isOpen ? 'open' : 'closed'}
          >
            <div className="menu-toggle-icon">
              <span className="menu-toggle-bar menu-toggle-bar--top" />
              <span className="menu-toggle-bar menu-toggle-bar--middle" />
              <span className="menu-toggle-bar menu-toggle-bar--bottom" />
            </div>
            <span className="ml-2 hidden sm:inline">{isOpen ? 'Fermer' : 'Menu'}</span>
          </button>
        </AnimatedItem>
      </div>
    );
  },
);

export default MenuButton;
