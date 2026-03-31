import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Phone from 'lucide-react/dist/esm/icons/phone';
import Mail from 'lucide-react/dist/esm/icons/mail';

import { STORE_INFO } from '@/config/store';
import { COMPANY_EMAIL } from '@/config/legal';

/**
 * FooterContact - Coordonnées + Horaires
 */
export default function FooterContact() {
  return (
    <div>
      {/* Contact */}
      <address className="not-italic" aria-label="Coordonnées">
        <h3 className="text-subtitle mb-4 text-body-sm text-accent">Contact</h3>
        <div className="space-y-3 text-body-sm text-white">
          <a
            href={STORE_INFO.address.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-style flex items-start gap-3 transition-colors duration-300 hover:text-secondary-orange"
          >
            <MapPin className="mt-1 h-4 w-4 flex-shrink-0 text-secondary-blue" aria-hidden="true" />
            <div>
              <p>{STORE_INFO.address.street}</p>
              <p>
                {STORE_INFO.address.postalCode} {STORE_INFO.address.city}
              </p>
            </div>
          </a>

          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 flex-shrink-0 text-secondary-blue" aria-hidden="true" />
            <a
              href={`tel:${STORE_INFO.phone.tel}`}
              className="focus-style font-semibold transition-colors duration-300 hover:text-secondary-orange"
            >
              {STORE_INFO.phone.display}
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 flex-shrink-0 text-secondary-blue" aria-hidden="true" />
            <a
              href={`mailto:${COMPANY_EMAIL}`}
              className="focus-style font-semibold transition-colors duration-300 hover:text-secondary-orange"
            >
              {COMPANY_EMAIL}
            </a>
          </div>
        </div>
      </address>

      {/* Horaires */}
      <div className="mt-6">
        <h3 className="text-subtitle mb-4 text-body-sm text-accent">Horaires</h3>
        <div className="text-body-sm">
          <p className="font-semibold text-white">{STORE_INFO.hours.weekdays}</p>
          <p className="text-secondary-blue">{STORE_INFO.hours.weekend}</p>
        </div>
      </div>
    </div>
  );
}
