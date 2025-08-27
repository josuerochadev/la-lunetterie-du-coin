// src/seo/LocalBusinessJsonLd.tsx (NEW)
import { Helmet } from '@dr.pogodin/react-helmet';

import { SITE_URL, DEFAULT_OG_IMAGE, BRAND } from '@/config/seo';

// Données fournies
export const COMPANY_NAME = 'La Lunetterie Du Coin Neuf & Occasion';
export const COMPANY_LEGAL_FORM = 'SASU';
export const COMPANY_ADDRESS = '24 rue du Faubourg de Pierre, 67000 Strasbourg, France';
export const COMPANY_SIRET = '81765775200017';
export const COMPANY_RCS = '817 657 752 RCS Strasbourg';
export const PUBLICATION_DIRECTOR = 'CORATO Romain-Guy';

const TELEPHONE = '+33 03 88 51 24 40';

export function LocalBusinessJsonLd() {
  const streetAddress = '24 rue du Faubourg de Pierre';
  const postalCode = '67000';
  const addressLocality = 'Strasbourg';
  const addressRegion = 'Grand Est';
  const addressCountry = 'FR';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Optician',
    name: COMPANY_NAME,
    url: SITE_URL,
    image: DEFAULT_OG_IMAGE,
    telephone: TELEPHONE || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress,
      postalCode,
      addressLocality,
      addressRegion,
      addressCountry,
    },
    openingHoursSpecification: [
      // Lundi–Samedi : 10:00–14:00, 15:00–19:00
      ...['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].flatMap((day) => [
        { '@type': 'OpeningHoursSpecification', dayOfWeek: day, opens: '10:00', closes: '14:00' },
        { '@type': 'OpeningHoursSpecification', dayOfWeek: day, opens: '15:00', closes: '19:00' },
      ]),
      // Dimanche fermé => on omet ou on met opens/closes null => omission recommandée
    ],
    legalName: `${COMPANY_NAME} ${COMPANY_LEGAL_FORM}`,
    // Identifiants légaux utiles
    identifier: [
      { '@type': 'PropertyValue', name: 'SIRET', value: COMPANY_SIRET },
      { '@type': 'PropertyValue', name: 'RCS', value: COMPANY_RCS },
      {
        '@type': 'PropertyValue',
        name: 'Directeur de la Publication',
        value: PUBLICATION_DIRECTOR,
      },
    ],
    priceRange: '€€',
    brand: BRAND,
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}
