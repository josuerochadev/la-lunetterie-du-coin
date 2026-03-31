import ExternalLink from 'lucide-react/dist/esm/icons/external-link';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Phone from 'lucide-react/dist/esm/icons/phone';
import Mail from 'lucide-react/dist/esm/icons/mail';

import { STORE_INFO } from '@/config/store';
import { COMPANY_EMAIL } from '@/config/legal';
import { BOOKING_URL } from '@/config/endpoints';

/**
 * FooterContact - Coordonnées de contact du footer
 */
export default function FooterContact() {
  return (
    <address className="not-italic lg:max-w-md lg:flex-1" aria-label="Coordonnées">
      <h3 className="text-subtitle mb-4 text-body-sm text-accent">Contact</h3>
      <div className="space-y-3 text-body-sm text-white">
        {/* Adresse */}
        <a
          href={STORE_INFO.address.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-style flex items-start gap-3 transition-colors duration-300 hover:text-accent"
        >
          <MapPin className="mt-1 h-4 w-4 flex-shrink-0 text-secondary-green" aria-hidden="true" />
          <div>
            <p>{STORE_INFO.address.street}</p>
            <p>
              {STORE_INFO.address.postalCode} {STORE_INFO.address.city}
            </p>
          </div>
        </a>

        {/* Téléphone */}
        <div className="flex items-center gap-3">
          <Phone className="h-4 w-4 flex-shrink-0 text-secondary-green" aria-hidden="true" />
          <a
            href={`tel:${STORE_INFO.phone.tel}`}
            className="focus-style font-semibold transition-colors duration-300 hover:text-accent"
          >
            {STORE_INFO.phone.display}
          </a>
        </div>

        {/* Email */}
        <div className="flex items-center gap-3">
          <Mail className="h-4 w-4 flex-shrink-0 text-secondary-green" aria-hidden="true" />
          <a
            href={`mailto:${COMPANY_EMAIL}`}
            className="focus-style font-semibold transition-colors duration-300 hover:text-accent"
          >
            {COMPANY_EMAIL}
          </a>
        </div>
      </div>

      {/* Horaires */}
      <div className="mt-4">
        <h3 className="text-subtitle mb-4 text-body-sm text-accent">Horaires</h3>
        <div className="text-body-sm text-white">
          <p className="font-semibold">{STORE_INFO.hours.weekdays}</p>
          <p>{STORE_INFO.hours.weekend}</p>
        </div>
      </div>

      {/* CTA Prendre RDV */}
      <a
        href={BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group/cta focus-style text-subtitle relative mt-6 inline-flex items-center gap-2 text-body-sm text-accent transition-[font-weight] duration-300 hover:font-semibold"
      >
        Prendre RDV
        <ExternalLink
          className="h-3.5 w-3.5 flex-shrink-0 text-secondary-green transition-transform duration-300 group-hover/cta:translate-x-1"
          aria-hidden="true"
        />
        <span
          className="absolute -bottom-1 left-0 h-[1.5px] w-0 bg-secondary-orange transition-all duration-300 group-hover/cta:w-full"
          aria-hidden="true"
        />
      </a>
    </address>
  );
}
