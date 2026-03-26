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
        description="Contactez La Lunetterie du Coin à Strasbourg. Formulaire de contact, informations pratiques, prise de rendez-vous et plan d'accès."
        canonicalPath="/contact"
      />
      <Layout>
        {/* Hero — fond jaune, "PASSEZ NOUS VOIR" zoom */}
        <StickySection zIndex={11} enableSticky>
          <ContactHero />
        </StickySection>

        {/* Infos pratiques — fond noir, cascade */}
        <StickySection zIndex={12}>
          <ContactInfo />
        </StickySection>

        {/* Formulaire — fond blanc */}
        <StickySection zIndex={13}>
          <ContactFormSection />
        </StickySection>

        {/* Localisation — photo plein écran */}
        <StickySection zIndex={14}>
          <ContactLocation />
        </StickySection>

        {/* RDV Calendly — fond jaune */}
        <StickySection zIndex={15} enableSticky wrapperMinHeight="200vh">
          <ContactAppointment />
        </StickySection>
      </Layout>
    </>
  );
}
