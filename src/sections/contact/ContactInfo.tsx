import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Phone from 'lucide-react/dist/esm/icons/phone';
import Mail from 'lucide-react/dist/esm/icons/mail';
import Clock from 'lucide-react/dist/esm/icons/clock';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import { COMPANY_ADDRESS, COMPANY_EMAIL, COMPANY_PHONE } from '@/config/legal';
import { OPENING_HOURS } from '@/data/contact';

export default function ContactInfo() {
  return (
    <section
      id="informations-pratiques"
      className="relative"
      style={{ background: 'linear-gradient(to bottom, transparent 12vw, #000 12vw)' }}
      data-navbar-theme="light"
    >
      {/* Convex dome — black dome with transparent corners revealing the hero behind */}
      <svg
        className="pointer-events-none absolute left-0 top-0 z-[1] w-full"
        style={{ height: '12vw' }}
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0,120 Q720,-120 1440,120 Z" fill="#000" />
      </svg>

      <div className="mx-auto max-w-container px-container-x py-section">
        <div className="mx-auto max-w-5xl">
          <SimpleAnimation type="slide-up" delay={0}>
            <h2 className="heading-section mb-12 text-center text-white">Les infos utiles</h2>
          </SimpleAnimation>

          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            {/* Adresse */}
            <SimpleAnimation type="slide-right" delay={0}>
              <div className="border-t border-white/10 pt-6">
                <div className="mb-3 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-accent" aria-hidden="true" />
                  <h3 className="heading-subsection text-white">Adresse</h3>
                </div>
                <address className="mb-3 text-body not-italic text-white/50">
                  {COMPANY_ADDRESS}
                </address>
                <a
                  href="https://maps.google.com/?q=24+rue+du+Faubourg+de+Pierre+67000+Strasbourg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-body-sm font-medium text-accent transition-colors hover:text-white"
                >
                  Voir sur Google Maps →
                </a>
              </div>
            </SimpleAnimation>

            {/* Téléphone */}
            <SimpleAnimation type="slide-left" delay={50}>
              <div className="border-t border-white/10 pt-6">
                <div className="mb-3 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-accent" aria-hidden="true" />
                  <h3 className="heading-subsection text-white">Téléphone</h3>
                </div>
                <a
                  href={`tel:${COMPANY_PHONE.replace(/\s/g, '')}`}
                  className="text-body text-white/50 transition-colors hover:text-accent"
                >
                  {COMPANY_PHONE}
                </a>
              </div>
            </SimpleAnimation>

            {/* Email */}
            <SimpleAnimation type="slide-right" delay={100}>
              <div className="border-t border-white/10 pt-6">
                <div className="mb-3 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-accent" aria-hidden="true" />
                  <h3 className="heading-subsection text-white">Email</h3>
                </div>
                <a
                  href={`mailto:${COMPANY_EMAIL}`}
                  className="text-body text-white/50 transition-colors hover:text-accent"
                >
                  {COMPANY_EMAIL}
                </a>
              </div>
            </SimpleAnimation>

            {/* Horaires */}
            <SimpleAnimation type="slide-left" delay={150}>
              <div className="border-t border-white/10 pt-6">
                <div className="mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-accent" aria-hidden="true" />
                  <h3 className="heading-subsection text-white">Horaires d&apos;ouverture</h3>
                </div>
                <dl className="space-y-2">
                  {OPENING_HOURS.map((schedule) => (
                    <div key={schedule.day} className="flex justify-between text-body-sm">
                      <dt className="font-medium text-white/70">{schedule.day}</dt>
                      <dd className="text-white/50">{schedule.hours}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </SimpleAnimation>
          </div>
        </div>
      </div>
    </section>
  );
}
