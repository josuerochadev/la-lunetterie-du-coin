import Layout from '@/components/common/Layout';
import StickySection from '@/components/common/StickySection';
import ContactHero from '@/sections/contact/ContactHero';
import ContactInfo from '@/sections/contact/ContactInfo';
import ContactFormSection from '@/sections/contact/ContactFormSection';
import ContactLocation from '@/sections/contact/ContactLocation';
import ContactAppointment from '@/sections/contact/ContactAppointment';
import { useNativeScroll } from '@/hooks/useNativeScroll';
import { Seo } from '@/seo/Seo';

export default function ContactPage() {
  useNativeScroll();

  return (
    <>
      <Seo
        title="Nous contacter - La Lunetterie du Coin"
        description="Passez nous voir au 24 rue du Faubourg de Pierre à Strasbourg. Prise de rendez-vous, horaires et plan d'accès."
        canonicalPath="/contact"
      />
      <Layout>
        {/* Hero — sticky, Info monte par-dessus */}
        <StickySection zIndex={11} enableSticky>
          <ContactHero />
        </StickySection>

        {/* Infos — scroll normal, gradient dissolve vers le formulaire */}
        <StickySection zIndex={12}>
          <ContactInfo />
        </StickySection>

        {/* Formulaire — scroll normal, contenu dépasse le viewport */}
        <StickySection zIndex={13}>
          <ContactFormSection />
        </StickySection>

        {/* Localisation — photo plein écran, scroll normal pour voir tout le contenu */}
        <StickySection zIndex={14}>
          <ContactLocation />
        </StickySection>

        {/* Prise de rendez-vous — gère son propre sticky + 200vh en interne */}
        <StickySection zIndex={15}>
          <ContactAppointment />
        </StickySection>
      </Layout>
    </>
  );
}
