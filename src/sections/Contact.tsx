// src/sections/Contact.tsx

import SectionContainer from '@/components/common/SectionContainer';
import SectionTitle from '@/components/common/SectionTitle';
import ContactForm from '@/components/contact/ContactForm';

/**
 * Composant principal pour la section "Nous contacter" de la page.
 *
 * Affiche un conteneur stylisé avec un titre de section et un formulaire de contact.
 *
 * @component
 * @returns {JSX.Element} La section de contact à afficher.
 */
export default function Contact() {
  return (
    <SectionContainer 
      id="contact" 
      className="bg-boat relative text-accent shadow-xl"
      overlayClassName="bg-transparent"
    >
      <SectionTitle title="Nous contacter" />
      <div className="mx-auto max-w-4xl lg:max-w-5xl">
        <ContactForm />
      </div>
    </SectionContainer>
  );
}
