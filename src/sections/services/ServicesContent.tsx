import { ServiceEditorialCard } from '@/components/services/ServiceEditorialCard';
import { CALENDLY_URL } from '@/config/endpoints';
import { SERVICES_DATA } from '@/data/services';

/**
 * Section ServicesContent - Contenu principal de la page Services
 *
 * Affiche la liste des services en layout éditorial 50/50 alterné.
 * Inclut la logique spéciale pour le service "examens" avec conditions
 * et lien Calendly.
 *
 * @component
 * @returns {JSX.Element} Section contenu de la page Services
 */
export default function ServicesContent() {
  return (
    <section className="relative w-full bg-background py-section">
      <div className="mx-auto max-w-container px-container-x">
        <div className="space-y-24 lg:space-y-32">
          {SERVICES_DATA.map((service, index) => {
            const isEven = index % 2 === 0;

            // Contenu additionnel pour les examens (conditions + CTA)
            const examensAdditionalContent =
              service.id === 'examens' ? (
                <>
                  <div
                    className={`${isEven ? 'border-l-4' : 'border-r-4'} border-accent/30 bg-accent/5 p-6`}
                  >
                    <h4 className="mb-3 text-body font-medium text-text">
                      Conditions pour réaliser un examen de vue en magasin :
                    </h4>
                    <ul className="space-y-2 text-body-sm text-black/50">
                      <li className="flex gap-2">
                        <span>•</span>
                        <span>
                          Ordonnance de moins de 5 ans pour les 16-42 ans, ou moins de 3 ans pour
                          les 42 ans et plus
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span>•</span>
                        <span>
                          L'ordonnance ne doit pas comporter de mention contre-indiquant l'examen
                          hors cabinet médical
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span>•</span>
                        <span>
                          Non autorisé pour les personnes diabétiques ou présentant un kératocône,
                          glaucome ou cataracte
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className={isEven ? '' : 'flex justify-end'}>
                    <a
                      href={CALENDLY_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button-primary px-6 py-3 text-body"
                      aria-label="Prendre rendez-vous"
                    >
                      Prendre rendez-vous
                    </a>
                  </div>
                </>
              ) : undefined;

            return (
              <ServiceEditorialCard
                key={service.id}
                service={service}
                imagePosition={isEven ? 'left' : 'right'}
                index={index}
                additionalContent={examensAdditionalContent}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
