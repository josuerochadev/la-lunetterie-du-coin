import Facebook from 'lucide-react/dist/esm/icons/facebook';
import Instagram from 'lucide-react/dist/esm/icons/instagram';

import { FOOTER_SOCIALS } from '@/config/constants';

/**
 * FooterSocial - Liens réseaux sociaux du footer
 */
export default function FooterSocial() {
  return (
    <div className="lg:w-auto">
      <h3 className="mb-3 text-body font-bold uppercase tracking-wider text-cream">Suivez-nous</h3>
      <div className="flex gap-4">
        {FOOTER_SOCIALS.map((social) => {
          const IconComponent = social.icon === 'facebook' ? Facebook : Instagram;
          return (
            <a
              key={social.href}
              href={social.href}
              className="focus-style flex h-10 w-10 items-center justify-center border border-cream text-cream transition-all duration-300 hover:border-orange hover:bg-orange"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
            >
              <IconComponent className="h-5 w-5" aria-hidden="true" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
