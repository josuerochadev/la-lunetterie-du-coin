import { SERVICE_COUNT } from './constants';

import LinkCTA from '@/components/common/LinkCTA';
import { HOMEPAGE_SERVICES } from '@/data/homepage';

/**
 * Static fallback for reduced motion — no scroll animations.
 */
export function StaticServiceList() {
  return (
    <div className="mx-auto max-w-container space-y-16 px-container-x">
      {HOMEPAGE_SERVICES.map((service, i) => (
        <div key={service.title} className="flex items-center gap-12">
          <div className="relative aspect-[3/4] w-[45%] shrink-0 overflow-hidden rounded-sm">
            <img
              src={service.image}
              alt={service.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="w-[45%]">
            <span className="mb-2 block text-sm font-medium uppercase tracking-widest text-black">
              {String(i + 1).padStart(2, '0')} / {String(SERVICE_COUNT).padStart(2, '0')}
            </span>
            <h3 className="text-subtitle mb-3 text-title-sm text-black">{service.title}</h3>
            <p className="text-body text-black">{service.description}</p>
            <LinkCTA
              to={service.link}
              theme="light"
              className="mt-4"
              aria-label={`En savoir plus sur ${service.title}`}
            >
              En savoir plus
            </LinkCTA>
          </div>
        </div>
      ))}
    </div>
  );
}
