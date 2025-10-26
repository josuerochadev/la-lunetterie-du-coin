import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Phone from 'lucide-react/dist/esm/icons/phone';
import Mail from 'lucide-react/dist/esm/icons/mail';

import { STORE_INFO, COMPANY_EMAIL } from '@/config/constants';

/**
 * FooterContact - Coordonnées de contact du footer
 */
export default function FooterContact() {
  return (
    <address className="not-italic lg:max-w-md lg:flex-1" aria-label="Coordonnées">
      <h3 className="mb-3 text-body font-bold uppercase tracking-wider text-cream">Contact</h3>
      <div className="space-y-3 text-body-sm text-cream">
        {/* Adresse */}
        <div className="flex items-start gap-3">
          <MapPin className="mt-1 h-4 w-4 flex-shrink-0" aria-hidden="true" />
          <div>
            <p>{STORE_INFO.address.street}</p>
            <p>
              {STORE_INFO.address.postalCode} {STORE_INFO.address.city}
            </p>
          </div>
        </div>

        {/* Téléphone */}
        <div className="flex items-center gap-3">
          <Phone className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          <a
            href={`tel:${STORE_INFO.phone.tel}`}
            className="focus-style font-semibold transition-colors duration-300 hover:text-orange"
          >
            {STORE_INFO.phone.display}
          </a>
        </div>

        {/* Email */}
        <div className="flex items-center gap-3">
          <Mail className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          <a
            href={`mailto:${COMPANY_EMAIL}`}
            className="focus-style font-semibold transition-colors duration-300 hover:text-orange"
          >
            {COMPANY_EMAIL}
          </a>
        </div>

        {/* Horaires */}
        <div className="pt-2 text-body-sm">
          <p className="font-semibold">{STORE_INFO.hours.weekdays}</p>
          <p>{STORE_INFO.hours.weekend}</p>
        </div>
      </div>
    </address>
  );
}
