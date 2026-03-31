import { SERVICE_COUNT } from './constants';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import LinkCTA from '@/components/common/LinkCTA';
import { SERVICES_DATA } from '@/data/services';
import { BOOKING_URL } from '@/config/endpoints';

export function MobileServiceList() {
  return (
    <div className="space-y-16 sm:space-y-20">
      {SERVICES_DATA.map((service, index) => {
        const isExamens = service.id === 'examens';
        return (
          <article key={service.id}>
            <SimpleAnimation type="fade" delay={index * 80}>
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm">
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-full w-full object-cover"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </div>
              <div className="mt-8">
                <span className="mb-3 block text-body-sm font-medium uppercase tracking-widest text-white">
                  {String(index + 1).padStart(2, '0')} / {String(SERVICE_COUNT).padStart(2, '0')}
                </span>
                <h3
                  className="text-heading mb-4 text-accent"
                  style={{ fontSize: 'clamp(1.6rem, 6vw, 2.4rem)', lineHeight: '1.1' }}
                >
                  {service.title}
                </h3>
                <p className="mb-6 text-body-lg leading-relaxed text-white">
                  {service.description}
                </p>

                <ul className="mb-6 grid grid-cols-1 gap-y-2 sm:grid-cols-2 sm:gap-x-6">
                  {service.details.map((detail, i) => (
                    <li key={i} className="flex gap-2.5 text-body-sm text-white">
                      <span
                        className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-secondary-orange"
                        aria-hidden="true"
                      />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>

                {isExamens && (
                  <div className="mb-6 border-l-2 border-accent/30 pl-4">
                    <h4 className="mb-2 text-body-sm font-medium text-white">
                      Conditions pour un examen en magasin
                    </h4>
                    <ul className="space-y-1 text-body-sm text-white">
                      <li>
                        Ordonnance {'<'} 5 ans (16-42 ans) ou {'<'} 3 ans (42+)
                      </li>
                      <li>Pas de mention contre-indiquant l&apos;examen hors cabinet</li>
                      <li>Non autorisé : diabète, kératocône, glaucome, cataracte</li>
                    </ul>
                  </div>
                )}

                {isExamens ? (
                  <LinkCTA
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    theme="dark"
                    aria-label="Prendre rendez-vous pour un examen de vue"
                  >
                    Prendre rendez-vous
                  </LinkCTA>
                ) : (
                  <LinkCTA
                    to="/contact"
                    theme="dark"
                    aria-label={`En savoir plus sur ${service.title}`}
                  >
                    Nous contacter
                  </LinkCTA>
                )}
              </div>
            </SimpleAnimation>
          </article>
        );
      })}
    </div>
  );
}
