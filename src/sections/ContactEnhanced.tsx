import { forwardRef } from 'react';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Phone from 'lucide-react/dist/esm/icons/phone';
import Mail from 'lucide-react/dist/esm/icons/mail';
import Clock from 'lucide-react/dist/esm/icons/clock';

import SectionContainer from '@/components/common/SectionContainer';
import ContactForm from '@/components/contact/ContactForm';
import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import { COMPANY_ADDRESS, COMPANY_EMAIL, COMPANY_PHONE } from '@/config/constants';

/**
 * Section Contact améliorée (Phase 2)
 *
 * Layout 50/50 avec :
 * - Gauche : Informations pratiques (adresse, téléphone, email, horaires)
 * - Droite : Formulaire de contact
 *
 * Style minimaliste cohérent avec le redesign :
 * - Typographie Jost
 * - Palette crème/charcoal/stone/orange
 * - Espaces généreux
 * - Icônes subtiles
 *
 * @component
 * @returns {JSX.Element} La section Contact améliorée
 */
const ContactEnhanced = forwardRef<HTMLElement>(() => {
  const openingHours = [
    { day: 'Lundi', hours: 'Fermé' },
    { day: 'Mardi', hours: '10h00 - 13h00 • 14h00 - 19h00' },
    { day: 'Mercredi', hours: '10h00 - 13h00 • 14h00 - 19h00' },
    { day: 'Jeudi', hours: '10h00 - 13h00 • 14h00 - 19h00' },
    { day: 'Vendredi', hours: '10h00 - 13h00 • 14h00 - 19h00' },
    { day: 'Samedi', hours: '10h00 - 13h00 • 14h00 - 18h00' },
    { day: 'Dimanche', hours: 'Fermé' },
  ];

  return (
    <SectionContainer
      id="contact"
      className="bg-background py-section"
      aria-labelledby="contact-title"
    >
      <div className="container mx-auto px-container-x">
        {/* En-tête */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <SimpleAnimation type="slide-up" delay={0}>
            <h2 id="contact-title" className="mb-4 text-title-md font-medium text-text">
              Nous contacter
            </h2>
          </SimpleAnimation>

          <SimpleAnimation type="slide-up" delay={100}>
            <p className="text-body-lg text-stone">
              Une question ? N'hésitez pas à nous contacter, nous vous répondrons avec plaisir
            </p>
          </SimpleAnimation>
        </div>

        {/* Layout 50/50 */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Colonne gauche : Informations */}
          <div className="space-y-8">
            {/* Adresse */}
            <SimpleAnimation type="slide-up" delay={0}>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <MapPin className="h-6 w-6 text-accent" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="mb-2 text-body-lg font-medium text-text">Adresse</h3>
                  <address className="text-body not-italic leading-relaxed text-stone">
                    {COMPANY_ADDRESS}
                  </address>
                  <a
                    href="https://maps.google.com/?q=24+rue+du+Faubourg+de+Pierre+67000+Strasbourg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-body-sm font-medium text-accent transition-colors hover:text-text"
                  >
                    Voir sur Google Maps →
                  </a>
                </div>
              </div>
            </SimpleAnimation>

            {/* Téléphone */}
            <SimpleAnimation type="slide-up" delay={100}>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Phone className="h-6 w-6 text-accent" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="mb-2 text-body-lg font-medium text-text">Téléphone</h3>
                  <a
                    href={`tel:${COMPANY_PHONE.replace(/\s/g, '')}`}
                    className="text-body text-stone transition-colors hover:text-accent"
                  >
                    {COMPANY_PHONE}
                  </a>
                </div>
              </div>
            </SimpleAnimation>

            {/* Email */}
            <SimpleAnimation type="slide-up" delay={200}>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Mail className="h-6 w-6 text-accent" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="mb-2 text-body-lg font-medium text-text">Email</h3>
                  <a
                    href={`mailto:${COMPANY_EMAIL}`}
                    className="text-body text-stone transition-colors hover:text-accent"
                  >
                    {COMPANY_EMAIL}
                  </a>
                </div>
              </div>
            </SimpleAnimation>

            {/* Horaires */}
            <SimpleAnimation type="slide-up" delay={300}>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-accent" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-4 text-body-lg font-medium text-text">Horaires d'ouverture</h3>
                  <dl className="space-y-2">
                    {openingHours.map((schedule) => (
                      <div key={schedule.day} className="flex justify-between text-body">
                        <dt className="font-medium text-text">{schedule.day}</dt>
                        <dd className={schedule.hours === 'Fermé' ? 'text-stone/60' : 'text-stone'}>
                          {schedule.hours}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </SimpleAnimation>
          </div>

          {/* Colonne droite : Formulaire */}
          <SimpleAnimation type="slide-up" delay={200}>
            <div className="rounded-sm border border-stone/20 bg-surface p-8 shadow-soft">
              <h3 className="mb-6 text-body-lg font-medium text-text">Envoyez-nous un message</h3>
              <ContactForm />
            </div>
          </SimpleAnimation>
        </div>
      </div>
    </SectionContainer>
  );
});

ContactEnhanced.displayName = 'ContactEnhanced';

export default ContactEnhanced;
