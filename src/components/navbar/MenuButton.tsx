import { forwardRef } from 'react';

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
      <button
        ref={ref}
        type="button"
        id={id}
        onClick={onClick}
        aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={isOpen}
        aria-controls="main-menu"
        className="inline-flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-body-sm text-charcoal transition-colors hover:text-orange focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <div className="relative block h-4 w-5 flex-shrink-0">
          <span
            className={`absolute left-0 right-0 h-[2px] bg-current transition-all duration-200 ${
              isOpen ? 'top-[7px] rotate-45' : 'top-0'
            }`}
          />
          <span
            className={`absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 bg-current transition-all duration-200 ${
              isOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`absolute left-0 right-0 h-[2px] bg-current transition-all duration-200 ${
              isOpen ? 'bottom-[7px] -rotate-45' : 'bottom-0'
            }`}
          />
        </div>
        <span className="hidden font-medium sm:inline">{isOpen ? 'Fermer' : 'Menu'}</span>
      </button>
    );
  },
);

export default MenuButton;
