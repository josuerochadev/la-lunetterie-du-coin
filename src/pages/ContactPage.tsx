import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Phone from 'lucide-react/dist/esm/icons/phone';
import Mail from 'lucide-react/dist/esm/icons/mail';
import Clock from 'lucide-react/dist/esm/icons/clock';
import Car from 'lucide-react/dist/esm/icons/car';
import Train from 'lucide-react/dist/esm/icons/train';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import Layout from '@/components/common/Layout';
import ContactForm from '@/components/contact/ContactForm';
import { useNativeScroll } from '@/hooks/useNativeScroll';
import { Seo } from '@/seo/Seo';
import { COMPANY_ADDRESS, COMPANY_EMAIL, COMPANY_PHONE, CALENDLY_URL } from '@/config/constants';

/**
 * Page Contact complète
 *
 * Sections :
 * - Hero avec titre et intro
 * - Formulaire de contact
 * - Informations pratiques (adresse, téléphone, email, horaires)
 * - Prise de rendez-vous Calendly
 * - Plan d'accès Google Maps + Comment nous rejoindre
 *
 * Style éditorial minimal cohérent avec le redesign
 *
 * @component
 * @returns {JSX.Element} Page Contact complète
 */
export default function ContactPage() {
  useNativeScroll();

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
    <>
      <Seo
        title="Nous contacter - La Lunetterie du Coin"
        description="Contactez La Lunetterie du Coin à Strasbourg. Formulaire de contact, informations pratiques, prise de rendez-vous et plan d'accès."
        canonicalPath="/contact"
      />
      <Layout>
        {/* Hero */}
        <section className="relative w-full bg-background py-section">
          <div className="mx-auto max-w-container px-container-x">
            <div className="mx-auto max-w-4xl text-center">
              <SimpleAnimation type="slide-up" delay={0}>
                <h1 className="mb-6 text-title-lg font-medium text-text">Nous contacter</h1>
              </SimpleAnimation>

              <SimpleAnimation type="slide-up" delay={100}>
                <p className="text-body-lg leading-relaxed text-stone">
                  Une question ? Besoin d'un conseil ? N'hésitez pas à nous contacter, nous vous
                  répondrons avec plaisir
                </p>
              </SimpleAnimation>
            </div>
          </div>
        </section>

        {/* Formulaire de contact */}
        <section className="relative w-full bg-background py-section">
          <div className="mx-auto max-w-container px-container-x">
            <div className="mx-auto max-w-2xl">
              <SimpleAnimation type="slide-up" delay={0}>
                <h2 className="mb-8 text-center text-title-md font-medium text-text">
                  Envoyez-nous un message
                </h2>
              </SimpleAnimation>

              <SimpleAnimation type="fade" delay={100}>
                <ContactForm />
              </SimpleAnimation>
            </div>
          </div>
        </section>

        {/* Informations pratiques */}
        <section className="relative w-full bg-background py-section">
          <div className="mx-auto max-w-container px-container-x">
            <div className="mx-auto max-w-4xl">
              <SimpleAnimation type="slide-up" delay={0}>
                <h2 className="mb-12 text-center text-title-md font-medium text-text">
                  Informations pratiques
                </h2>
              </SimpleAnimation>

              <div className="grid gap-8 md:grid-cols-2 md:gap-12">
                {/* Adresse */}
                <SimpleAnimation type="fade" delay={0}>
                  <div className="border-t border-stone/20 pt-6">
                    <div className="mb-3 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-accent" aria-hidden="true" />
                      <h3 className="text-body-lg font-medium text-text">Adresse</h3>
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
                      <h3 className="text-body-lg font-medium text-text">Téléphone</h3>
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
                      <h3 className="text-body-lg font-medium text-text">Email</h3>
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
                      <h3 className="text-body-lg font-medium text-text">Horaires d'ouverture</h3>
                    </div>
                    <dl className="space-y-2">
                      {openingHours.map((schedule) => (
                        <div key={schedule.day} className="flex justify-between text-body-sm">
                          <dt className="font-medium text-text">{schedule.day}</dt>
                          <dd
                            className={schedule.hours === 'Fermé' ? 'text-stone/60' : 'text-stone'}
                          >
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
        </section>

        {/* Prise de rendez-vous Calendly */}
        <section className="relative w-full bg-background py-section">
          <div className="mx-auto max-w-container px-container-x">
            <div className="mx-auto max-w-4xl">
              <SimpleAnimation type="slide-up" delay={0}>
                <h2 className="mb-6 text-center text-title-md font-medium text-text">
                  Prendre rendez-vous
                </h2>
              </SimpleAnimation>

              <SimpleAnimation type="slide-up" delay={100}>
                <p className="mb-8 text-center text-body-lg text-stone">
                  Réservez directement votre créneau pour un examen de vue, un essayage ou un simple
                  conseil
                </p>
              </SimpleAnimation>

              <SimpleAnimation type="fade" delay={200}>
                <div className="relative w-full overflow-hidden" style={{ minHeight: '700px' }}>
                  <iframe
                    src={CALENDLY_URL}
                    width="100%"
                    height="700"
                    frameBorder="0"
                    title="Prendre rendez-vous avec La Lunetterie du Coin"
                    className="calendly-inline-widget"
                  />
                </div>
              </SimpleAnimation>
            </div>
          </div>
        </section>

        {/* Plan d'accès + Comment nous rejoindre */}
        <section className="relative w-full bg-background py-section">
          <div className="mx-auto max-w-container px-container-x">
            <div className="mx-auto max-w-4xl">
              <SimpleAnimation type="slide-up" delay={0}>
                <h2 className="mb-12 text-center text-title-md font-medium text-text">
                  Comment nous rejoindre
                </h2>
              </SimpleAnimation>

              {/* Google Maps */}
              <SimpleAnimation type="fade" delay={100}>
                <div className="mb-12 overflow-hidden border-t border-stone/20 pt-8">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2639.1234567890!2d7.7453277!3d48.5823394!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4796c84f95e5e877%3A0x88d0f0f0f0f0f0f0!2s24%20Rue%20du%20Faubourg%20de%20Pierre%2C%2067000%20Strasbourg!5e0!3m2!1sfr!2sfr!4v1234567890"
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Plan d'accès à La Lunetterie du Coin"
                  />
                </div>
              </SimpleAnimation>

              {/* Accès en voiture / transports */}
              <div className="grid gap-8 md:grid-cols-2 md:gap-12">
                {/* En voiture */}
                <SimpleAnimation type="fade" delay={200}>
                  <div className="border-t border-stone/20 pt-6">
                    <div className="mb-4 flex items-center gap-2">
                      <Car className="h-5 w-5 text-accent" aria-hidden="true" />
                      <h3 className="text-body-lg font-medium text-text">En voiture</h3>
                    </div>
                    <div className="space-y-3 text-body text-stone">
                      <p>
                        <span className="font-medium text-text">Parking gratuit</span> disponible
                        dans les rues adjacentes
                      </p>
                      <p>
                        <span className="font-medium text-text">Parking payant</span> : Parking
                        Étoile (5 min à pied)
                      </p>
                      <p>Accès facile depuis le centre-ville et les boulevards périphériques</p>
                    </div>
                  </div>
                </SimpleAnimation>

                {/* En transports en commun */}
                <SimpleAnimation type="fade" delay={250}>
                  <div className="border-t border-stone/20 pt-6">
                    <div className="mb-4 flex items-center gap-2">
                      <Train className="h-5 w-5 text-accent" aria-hidden="true" />
                      <h3 className="text-body-lg font-medium text-text">En transports</h3>
                    </div>
                    <div className="space-y-3 text-body text-stone">
                      <p>
                        <span className="font-medium text-text">Tram C</span> : arrêt Pierre de
                        Coubertin (2 min à pied)
                      </p>
                      <p>
                        <span className="font-medium text-text">Bus 2, 15</span> : arrêt Faubourg de
                        Pierre (1 min à pied)
                      </p>
                      <p>À 15 minutes à pied de la gare centrale de Strasbourg</p>
                    </div>
                  </div>
                </SimpleAnimation>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
