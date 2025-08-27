import { Helmet } from '@dr.pogodin/react-helmet';

import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  OG_LOCALE,
  SITE_URL,
  TITLE_TEMPLATE,
} from '@/config/seo';

type SeoProps = {
  title?: string;
  description?: string;
  canonicalPath?: string; // ex: '/', '/mentions-legales'
  ogImage?: string;
  noIndex?: boolean;
};

const buildTitle = (title?: string) =>
  title && title !== DEFAULT_TITLE ? TITLE_TEMPLATE.replace('%s', title) : DEFAULT_TITLE;

export function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  canonicalPath,
  ogImage = DEFAULT_OG_IMAGE,
  noIndex = false,
}: SeoProps) {
  const canonicalUrl = canonicalPath ? `${SITE_URL.replace(/\/$/, '')}${canonicalPath}` : SITE_URL;

  return (
    <Helmet>
      {/* Base SEO */}
      <title>{buildTitle(title)}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Indexation */}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={OG_LOCALE} />
      <meta property="og:site_name" content={DEFAULT_TITLE} />
      <meta property="og:title" content={title ?? DEFAULT_TITLE} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={title ?? DEFAULT_TITLE} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title ?? DEFAULT_TITLE} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
