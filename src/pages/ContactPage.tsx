import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Phone from 'lucide-react/dist/esm/icons/phone';
import Mail from 'lucide-react/dist/esm/icons/mail';
import Clock from 'lucide-react/dist/esm/icons/clock';
import Car from 'lucide-react/dist/esm/icons/car';
import Train from 'lucide-react/dist/esm/icons/train';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import Layout from '@/components/common/Layout';
import SectionContainer from '@/components/common/SectionContainer';
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
    { day: 'Lundi', hours: '10h00 - 14h00 • 15h00 - 19h00' },
    { day: 'Mardi', hours: '10h00 - 14h00 • 15h00 - 19h00' },
    { day: 'Mercredi', hours: '10h00 - 14h00 • 15h00 - 19h00' },
    { day: 'Jeudi', hours: '10h00 - 14h00 • 15h00 - 19h00' },
    { day: 'Vendredi', hours: '10h00 - 14h00 • 15h00 - 19h00' },
    { day: 'Samedi', hours: '10h00 - 14h00 • 15h00 - 19h00' },
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
        {/* Hero - Style homepage avec hiérarchie forte */}
        <SectionContainer id="hero" className="bg-background py-section">
          <div className="mx-auto max-w-container px-container-x">
            <div className="mx-auto max-w-5xl">
              <SimpleAnimation type="slide-up" delay={0}>
                <div className="space-y-6">
                  <h1 className="heading-page">Nous contacter</h1>
                  <p
                    className="leading-relaxed text-stone"
                    style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}
                  >
                    Une question ? Besoin d'un conseil ? Nous sommes là pour vous accompagner
                  </p>
                </div>
              </SimpleAnimation>
            </div>
          </div>
        </SectionContainer>

        {/* Formulaire de contact */}
        <SectionContainer className="bg-background py-section" aria-labelledby="formulaire">
          <div className="mx-auto max-w-container px-container-x">
            <div className="mx-auto max-w-3xl">
              <SimpleAnimation type="slide-up" delay={0}>
                <h2 id="formulaire" className="heading-section mb-8 text-center">
                  Envoyez-nous un message
                </h2>
              </SimpleAnimation>

              <SimpleAnimation type="fade" delay={100}>
                <ContactForm />
              </SimpleAnimation>
            </div>
          </div>
        </SectionContainer>

        {/* Informations pratiques */}
        <SectionContainer
          className="bg-background py-section"
          aria-labelledby="informations-pratiques"
        >
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
        </SectionContainer>

        {/* Prise de rendez-vous Calendly */}
        <SectionContainer className="bg-background py-section" aria-labelledby="rendez-vous">
          <div className="mx-auto max-w-container px-container-x">
            <div className="mx-auto max-w-5xl">
              <SimpleAnimation type="slide-up" delay={0}>
                <h2 id="rendez-vous" className="heading-section mb-6 text-center">
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
        </SectionContainer>

        {/* Plan d'accès + Comment nous rejoindre - Layout 50/50 avec photo */}
        <SectionContainer className="bg-background py-section" aria-labelledby="comment-rejoindre">
          <div className="mx-auto max-w-container px-container-x">
            <SimpleAnimation type="slide-up" delay={0}>
              <h2 id="comment-rejoindre" className="heading-section mb-12 text-center">
                Comment nous rejoindre
              </h2>
            </SimpleAnimation>

            <div className="mx-auto max-w-6xl">
              {/* Layout 50/50 : Photo gauche - Informations droite */}
              <SimpleAnimation type="fade" delay={100}>
                <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
                  {/* Photo de la boutique */}
                  <div className="relative w-full">
                    <div className="relative aspect-[2/3] w-full overflow-hidden">
                      <img
                        src="/images/contact-informations-boutique-outside.jpg"
                        alt="Façade de La Lunetterie du Coin"
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Informations d'accès */}
                  <div className="space-y-8">
                    {/* En voiture */}
                    <div className="border-t border-stone/20 pt-6">
                      <div className="mb-4 flex items-center gap-2">
                        <Car className="h-5 w-5 text-accent" aria-hidden="true" />
                        <h3 className="heading-subsection">En voiture</h3>
                      </div>
                      <div className="space-y-2 text-body text-stone">
                        <p>
                          <span className="font-medium text-text">Parking payant</span> : Parking
                          Halles et Opéra Broglie (environ 10 min à pied)
                        </p>
                      </div>
                    </div>

                    {/* En transports en commun */}
                    <div className="border-t border-stone/20 pt-6">
                      <div className="mb-4 flex items-center gap-2">
                        <Train className="h-5 w-5 text-accent" aria-hidden="true" />
                        <h3 className="heading-subsection">En transports</h3>
                      </div>
                      <div className="space-y-2 text-body text-stone">
                        <p>
                          <span className="font-medium text-text">Tram B, C, F</span> : arrêt
                          Broglie (7 min à pied)
                        </p>
                        <p>
                          <span className="font-medium text-text">Tram A, D</span> : arrêt Ancienne
                          Synagogue / Les Halles (7 min à pied)
                        </p>
                        <p>
                          <span className="font-medium text-text">Bus C3</span> : arrêt Faubourg de
                          Pierre (2 min à pied)
                        </p>
                        <p>
                          <span className="font-medium text-text">Bus C6</span> : arrêt Tribunal (5
                          min à pied)
                        </p>
                        <p className="pt-2">
                          À 15 minutes à pied de la gare centrale de Strasbourg
                        </p>
                      </div>
                    </div>

                    {/* Accessibilité PMR */}
                    <div className="border-t border-stone/20 pt-6">
                      <p className="text-body text-stone">
                        <span className="font-medium text-text">Accessibilité :</span> Le magasin
                        est accessible aux personnes à mobilité réduite
                      </p>
                    </div>

                    {/* Bouton Google Maps */}
                    <div className="pt-4">
                      <a
                        href="https://maps.google.com/?q=24+rue+du+Faubourg+de+Pierre+67000+Strasbourg"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 border border-accent bg-transparent px-6 py-3 text-body font-medium text-accent transition-all hover:bg-accent hover:text-cream focus-visible:bg-accent focus-visible:text-cream"
                      >
                        <MapPin className="h-5 w-5" aria-hidden="true" />
                        Voir sur Google Maps
                      </a>
                    </div>
                  </div>
                </div>
              </SimpleAnimation>
            </div>
          </div>
        </SectionContainer>
      </Layout>
    </>
  );
}
