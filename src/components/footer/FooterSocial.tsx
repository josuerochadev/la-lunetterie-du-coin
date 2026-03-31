import ExternalLink from 'lucide-react/dist/esm/icons/external-link';

import { getSocialIcon } from '@/lib/iconRegistry';
import { FOOTER_SOCIALS } from '@/config/footer';
import { BOOKING_URL } from '@/config/endpoints';

/**
 * FooterSocial - Prendre RDV + Réseaux sociaux
 */
export default function FooterSocial() {
  return (
    <div>
      {/* CTA Prendre RDV — le titre sert de lien */}
      <a
        href={BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group/cta focus-style relative inline-flex items-center gap-2"
      >
        <h3 className="text-subtitle text-body-sm text-accent transition-[font-weight] duration-300 group-hover/cta:font-black">
          Prendre RDV
        </h3>
        <ExternalLink
          className="h-3.5 w-3.5 flex-shrink-0 text-secondary-orange transition-transform duration-300 group-hover/cta:translate-x-1"
          aria-hidden="true"
        />
      </a>

      {/* Réseaux sociaux */}
      <div className="mt-6">
        <h3 className="text-subtitle mb-4 text-body-sm text-accent">Suivez-nous</h3>
        <div className="flex gap-4">
          {FOOTER_SOCIALS.map((social) => {
            const Icon = getSocialIcon(social.iconName);
            return (
              <a
                key={social.href}
                href={social.href}
                className="focus-style flex h-10 w-10 items-center justify-center rounded-full text-secondary-blue transition-all duration-300 hover:scale-110 hover:bg-secondary-orange/15 hover:text-secondary-orange"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
