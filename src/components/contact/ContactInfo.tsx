import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Phone from 'lucide-react/dist/esm/icons/phone';
import Mail from 'lucide-react/dist/esm/icons/mail';
import Clock from 'lucide-react/dist/esm/icons/clock';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import SectionContainer from '@/components/common/SectionContainer';
import { COMPANY_ADDRESS, COMPANY_EMAIL, COMPANY_PHONE } from '@/config/constants';
import { OPENING_HOURS } from '@/data/contact';

/**
 * ContactInfo - Informations pratiques (adresse, téléphone, email, horaires)
 */
export default function ContactInfo() {
  return (
    <SectionContainer className="bg-background py-section" aria-labelledby="informations-pratiques">
      <div className="mx-auto max-w-container px-container-x">
        <div className="mx-auto max-w-5xl">
          <SimpleAnimation type="slide-up" delay={0}>
            <h2 id="informations-pratiques" className="heading-section mb-12 text-center">
              Informations pratiques
            </h2>
          </SimpleAnimation>

          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            {/* Adresse */}
            <SimpleAnimation type="fade" delay={0}>
              <div className="border-t border-stone/20 pt-6">
                <div className="mb-3 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-accent" aria-hidden="true" />
                  <h3 className="heading-subsection">Adresse</h3>
                </div>
                <address className="mb-3 text-body not-italic leading-relaxed text-stone">
                  {COMPANY_ADDRESS}
                </address>
                <a
                  href="https://maps.google.com/?q=24+rue+du+Faubourg+de+Pierre+67000+Strasbourg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-body-sm font-medium text-accent transition-colors hover:text-text"
                >
                  Voir sur Google Maps →
                </a>
              </div>
            </SimpleAnimation>

            {/* Téléphone */}
            <SimpleAnimation type="fade" delay={50}>
              <div className="border-t border-stone/20 pt-6">
                <div className="mb-3 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-accent" aria-hidden="true" />
                  <h3 className="heading-subsection">Téléphone</h3>
                </div>
                <a
                  href={`tel:${COMPANY_PHONE.replace(/\s/g, '')}`}
                  className="text-body text-stone transition-colors hover:text-accent"
                >
                  {COMPANY_PHONE}
                </a>
              </div>
            </SimpleAnimation>

            {/* Email */}
            <SimpleAnimation type="fade" delay={100}>
              <div className="border-t border-stone/20 pt-6">
                <div className="mb-3 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-accent" aria-hidden="true" />
                  <h3 className="heading-subsection">Email</h3>
                </div>
                <a
                  href={`mailto:${COMPANY_EMAIL}`}
                  className="text-body text-stone transition-colors hover:text-accent"
                >
                  {COMPANY_EMAIL}
                </a>
              </div>
            </SimpleAnimation>

            {/* Horaires */}
            <SimpleAnimation type="fade" delay={150}>
              <div className="border-t border-stone/20 pt-6">
                <div className="mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-accent" aria-hidden="true" />
                  <h3 className="heading-subsection">Horaires d'ouverture</h3>
                </div>
                <dl className="space-y-2">
                  {OPENING_HOURS.map((schedule) => (
                    <div key={schedule.day} className="flex justify-between text-body-sm">
                      <dt className="font-medium text-text">{schedule.day}</dt>
                      <dd className={schedule.hours === 'Fermé' ? 'text-stone/60' : 'text-stone'}>
                        {schedule.hours}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </SimpleAnimation>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
