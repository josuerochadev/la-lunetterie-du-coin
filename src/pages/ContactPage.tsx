import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import Layout from '@/components/common/Layout';
import SectionContainer from '@/components/common/SectionContainer';
import ContactForm from '@/components/contact/ContactForm';
import ContactHero from '@/components/contact/ContactHero';
import ContactInfo from '@/components/contact/ContactInfo';
import ContactAppointment from '@/components/contact/ContactAppointment';
import ContactLocation from '@/components/contact/ContactLocation';
import { useNativeScroll } from '@/hooks/useNativeScroll';
import { Seo } from '@/seo/Seo';

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

  return (
    <>
      <Seo
        title="Nous contacter - La Lunetterie du Coin"
        description="Contactez La Lunetterie du Coin à Strasbourg. Formulaire de contact, informations pratiques, prise de rendez-vous et plan d'accès."
        canonicalPath="/contact"
      />
      <Layout>
        {/* Hero */}
        <ContactHero />

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
        <ContactInfo />

        {/* Prise de rendez-vous Calendly */}
        <ContactAppointment />

        {/* Plan d'accès + Comment nous rejoindre */}
        <ContactLocation />
      </Layout>
    </>
  );
}
