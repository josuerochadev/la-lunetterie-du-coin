import type React from 'react';
import { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Phone from 'lucide-react/dist/esm/icons/phone';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';

import Logo from '@/assets/logo/Logo_LLDC_Noir.svg?react';
import motifCercleUrl from '@/assets/patterns/motif-cercle-jaune.svg';
import { getSocialIcon } from '@/lib/iconRegistry';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useMenuAnimation } from '@/hooks/useMenuAnimation';
import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import { OpeningHoursList } from '@/components/common/OpeningHoursList';
import { MENU_LEGAL_LINKS } from '@/config/menu';
import { BOOKING_URL } from '@/config/endpoints';
import { STORE_INFO } from '@/config/store';
import { FOOTER_SOCIALS, FOOTER_NAV_LINKS } from '@/config/footer';

type FullScreenMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

/**
 * Composant `FullScreenMenu` — Rebranding 2026
 *
 * Menu plein écran immersif avec motif cercle en arrière-plan.
 *
 * @param isOpen - Indique si le menu est ouvert
 * @param onClose - Fonction appelée pour fermer le menu
 */
const FullScreenMenu: React.FC<FullScreenMenuProps> = ({ isOpen, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  useClickOutside(menuRef, () => onClose(), isOpen);
  useMenuAnimation(isOpen, onClose, menuRef);

  if (!isOpen) return null;

  return (
    <nav
      id="main-menu"
      aria-label="Menu de navigation principal"
      tabIndex={-1}
      className="fixed inset-0 z-menu flex min-h-dvh touch-pan-y flex-col overflow-y-auto bg-black"
    >
      {/* Motif cercle arrière-plan */}
      <SimpleAnimation type="fade" delay={200} immediate={true}>
        <div
          className="pointer-events-none fixed inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url(${motifCercleUrl})`,
            backgroundSize: '600px',
            backgroundPosition: 'center',
            backgroundRepeat: 'repeat',
          }}
          aria-hidden="true"
        />
      </SimpleAnimation>

      <div ref={menuRef} className="relative flex w-full flex-1 flex-col">
        {/* Bouton de fermeture */}
        <div className="fixed right-0 top-0 z-10 px-4 pt-6 sm:px-6">
          <SimpleAnimation type="slide-down" delay={50} immediate={true}>
            <button
              onClick={onClose}
              className="focus-style group flex h-12 w-12 items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:text-secondary-orange"
              aria-label="Fermer le menu"
            >
              <span className="text-[2rem] font-light leading-none">&times;</span>
            </button>
          </SimpleAnimation>
        </div>

        {/* ── Mobile layout ─────────────────────────────────────────── */}
        <div className="flex min-h-dvh flex-col xl:hidden">
          {/* Logo */}
          <div className="px-6 pt-6">
            <SimpleAnimation type="fade" delay={50} immediate={true}>
              <Link
                to="/"
                onClick={onClose}
                className="inline-block transition-opacity duration-200 hover:opacity-80"
                aria-label="Retour à l'accueil - La Lunetterie Du Coin"
              >
                <Logo className="h-20 w-auto fill-accent sm:h-24 md:h-32" aria-hidden="true" />
              </Link>
            </SimpleAnimation>
          </div>

          {/* Nav links — centered vertically, main focus */}
          <div className="flex flex-1 items-center px-6">
            <nav aria-label="Navigation principale" className="space-y-3 sm:space-y-5 md:space-y-8">
              {FOOTER_NAV_LINKS.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <SimpleAnimation key={link.href} type="slide-up" delay={i * 80} immediate={true}>
                    <Link
                      to={link.href}
                      onClick={onClose}
                      className={`text-heading block text-title-md transition-colors duration-300 hover:text-secondary-orange sm:text-title-lg md:text-title-xl ${isActive ? 'text-accent' : 'text-white'}`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {link.label}
                    </Link>
                  </SimpleAnimation>
                );
              })}
            </nav>
          </div>

          {/* Bottom — infos empilées */}
          <div className="space-y-4 px-6 pb-8">
            {/* CTA Prendre RDV — style footer */}
            <SimpleAnimation type="slide-up" delay={FOOTER_NAV_LINKS.length * 80} immediate={true}>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="group/cta focus-style relative inline-flex items-center gap-2"
              >
                <span className="text-subtitle text-body-sm text-accent transition-[font-weight] duration-300 group-hover/cta:font-black md:text-body">
                  Prendre RDV
                </span>
                <ExternalLink
                  className="h-3.5 w-3.5 flex-shrink-0 text-secondary-orange transition-transform duration-300 group-hover/cta:translate-x-1 md:h-4 md:w-4"
                  aria-hidden="true"
                />
                <span
                  className="absolute -bottom-1 left-0 h-[1.5px] w-0 bg-secondary-orange transition-all duration-300 group-hover/cta:w-full"
                  aria-hidden="true"
                />
              </a>
            </SimpleAnimation>

            <SimpleAnimation
              type="slide-up"
              delay={FOOTER_NAV_LINKS.length * 80 + 50}
              immediate={true}
            >
              <div className="space-y-3 border-t border-secondary-blue/20 pt-4">
                {/* Horaires */}
                <OpeningHoursList />

                {/* Téléphone */}
                <a
                  href={`tel:${STORE_INFO.phone.tel}`}
                  className="focus-style flex items-center gap-2 text-body-sm text-white md:gap-3 md:text-body"
                >
                  <Phone className="h-4 w-4 text-secondary-blue md:h-5 md:w-5" aria-hidden="true" />
                  <span className="font-medium">{STORE_INFO.phone.display}</span>
                </a>

                {/* Adresse */}
                <a
                  href={STORE_INFO.address.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-style flex items-start gap-2 text-body-sm text-white md:gap-3 md:text-body"
                >
                  <MapPin
                    className="mt-0.5 h-4 w-4 flex-shrink-0 text-secondary-blue md:h-5 md:w-5"
                    aria-hidden="true"
                  />
                  <span className="font-medium">
                    {STORE_INFO.address.street}, {STORE_INFO.address.postalCode}{' '}
                    {STORE_INFO.address.city}
                  </span>
                </a>

                {/* Socials */}
                <div className="flex items-center gap-4 pt-1">
                  {FOOTER_SOCIALS.map((social) => {
                    const Icon = getSocialIcon(social.iconName);
                    return (
                      <a
                        key={social.href}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="focus-style text-secondary-blue transition-colors duration-300 hover:text-secondary-orange"
                        aria-label={social.label}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </a>
                    );
                  })}
                </div>

                {/* Legal */}
                <div className="flex gap-4 pt-1">
                  {MENU_LEGAL_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={onClose}
                      className="text-caption text-secondary-blue/50 transition-colors duration-300 hover:text-secondary-orange"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </SimpleAnimation>
          </div>
        </div>

        {/* ── Desktop layout ───────────────────────────────────────── */}
        <div className="hidden min-h-screen w-full items-center justify-center px-6 xl:flex">
          <div className="grid w-full max-w-5xl grid-cols-2 gap-20">
            {/* Colonne gauche : Navigation principale */}
            <div className="space-y-16 text-right">
              <nav aria-label="Navigation principale" className="space-y-6 text-right">
                {FOOTER_NAV_LINKS.map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
                    <SimpleAnimation
                      key={link.href}
                      type="slide-up"
                      delay={i * 80}
                      immediate={true}
                    >
                      <Link
                        to={link.href}
                        onClick={onClose}
                        className={`text-heading inline-block text-title-lg transition-colors duration-300 hover:text-secondary-orange ${isActive ? 'text-accent' : 'text-white'}`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {link.label}
                      </Link>
                    </SimpleAnimation>
                  );
                })}
              </nav>

              {/* Pages légales */}
              <nav aria-label="Pages légales" className="space-y-3 text-right">
                {MENU_LEGAL_LINKS.map((link, i) => (
                  <SimpleAnimation
                    key={link.href}
                    type="fade"
                    delay={FOOTER_NAV_LINKS.length * 80 + 100 + i * 60}
                    immediate={true}
                  >
                    <Link
                      to={link.href}
                      onClick={onClose}
                      className="inline-block text-body-sm text-secondary-blue transition-colors duration-300 hover:text-secondary-orange"
                    >
                      {link.label}
                    </Link>
                  </SimpleAnimation>
                ))}
              </nav>
            </div>

            {/* Colonne droite : Informations pratiques */}
            <aside className="space-y-8 border-l border-secondary-blue/20 pl-12">
              {/* Logo du magasin */}
              <SimpleAnimation type="slide-right" delay={150} immediate={true}>
                <Link
                  to="/"
                  onClick={onClose}
                  className="inline-block transition-opacity duration-200 hover:opacity-80"
                  aria-label="Retour à l'accueil - La Lunetterie Du Coin"
                >
                  <Logo className="h-28 w-auto fill-accent sm:h-32" aria-hidden="true" />
                </Link>
              </SimpleAnimation>

              {/* CTA Prendre RDV — style footer */}
              <SimpleAnimation type="slide-right" delay={300} immediate={true}>
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="group/cta focus-style relative inline-flex items-center gap-2"
                >
                  <h3 className="text-subtitle text-body-sm text-accent transition-[font-weight] duration-300 group-hover/cta:font-black">
                    Prendre RDV
                  </h3>
                  <ExternalLink
                    className="h-3.5 w-3.5 flex-shrink-0 text-secondary-orange transition-transform duration-300 group-hover/cta:translate-x-1"
                    aria-hidden="true"
                  />
                  <span
                    className="absolute -bottom-1 left-0 h-[1.5px] w-0 bg-secondary-orange transition-all duration-300 group-hover/cta:w-full"
                    aria-hidden="true"
                  />
                </a>
              </SimpleAnimation>

              {/* Infos pratiques */}
              <SimpleAnimation type="slide-right" delay={400} immediate={true}>
                <div className="space-y-4">
                  {/* Horaires */}
                  <OpeningHoursList />

                  {/* Téléphone */}
                  <a
                    href={`tel:${STORE_INFO.phone.tel}`}
                    className="focus-style group/link flex items-center gap-2 text-body-sm text-white"
                  >
                    <Phone className="h-4 w-4 text-secondary-blue" aria-hidden="true" />
                    <span className="relative font-medium">
                      {STORE_INFO.phone.display}
                      <span
                        className="absolute -bottom-0.5 left-0 h-[1px] w-0 bg-secondary-orange transition-all duration-300 group-hover/link:w-full"
                        aria-hidden="true"
                      />
                    </span>
                  </a>

                  {/* Adresse */}
                  <a
                    href={STORE_INFO.address.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-style group/link flex items-start gap-2 text-body-sm text-white"
                  >
                    <MapPin
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-secondary-blue"
                      aria-hidden="true"
                    />
                    <span className="relative font-medium">
                      {STORE_INFO.address.street}
                      <br />
                      {STORE_INFO.address.postalCode} {STORE_INFO.address.city}
                      <span
                        className="absolute -bottom-0.5 left-0 h-[1px] w-0 bg-secondary-orange transition-all duration-300 group-hover/link:w-full"
                        aria-hidden="true"
                      />
                    </span>
                  </a>
                </div>
              </SimpleAnimation>

              {/* Social Media */}
              <SimpleAnimation type="slide-up" delay={500} immediate={true}>
                <div className="flex items-center gap-6">
                  {FOOTER_SOCIALS.map((social) => {
                    const Icon = getSocialIcon(social.iconName);
                    return (
                      <a
                        key={social.href}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="focus-style group flex h-10 w-10 items-center justify-center rounded-full text-secondary-blue transition-all duration-300 hover:scale-110 hover:bg-secondary-orange/15 hover:text-secondary-orange"
                        aria-label={social.label}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </a>
                    );
                  })}
                </div>
              </SimpleAnimation>
            </aside>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default FullScreenMenu;
