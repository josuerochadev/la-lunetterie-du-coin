import { getSocialIcon } from '@/lib/iconRegistry';
import { FOOTER_SOCIALS } from '@/config/footer';

/**
 * FooterSocial - Liens réseaux sociaux du footer
 *
 * Utilise getSocialIcon pour résoudre les icônes dynamiquement
 * à partir des noms définis dans FOOTER_SOCIALS.
 * Gère automatiquement les icônes manquantes avec un fallback.
 *
 * @component
 */
export default function FooterSocial() {
  return (
    <div className="lg:w-auto">
      <h3 className="text-subtitle mb-4 text-body-sm text-accent">Suivez-nous</h3>
      <div className="flex gap-4">
        {FOOTER_SOCIALS.map((social) => {
          const Icon = getSocialIcon(social.iconName);
          return (
            <a
              key={social.href}
              href={social.href}
              className="focus-style flex h-10 w-10 items-center justify-center rounded-full text-secondary-green transition-all duration-300 hover:scale-110 hover:bg-secondary-orange/15 hover:text-secondary-orange"
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
  );
}
