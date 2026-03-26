import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import ContactForm from '@/components/contact/ContactForm';

export default function ContactFormSection() {
  return (
    <section id="formulaire" className="relative bg-background" data-navbar-theme="dark">
      {/* Convex curve transition from black info section */}
      <div
        className="pointer-events-none absolute -top-[11vw] left-1/2 z-20 h-[45vw] w-[140vw] -translate-x-1/2 rounded-[50%] bg-background"
        data-navbar-theme="dark"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-container px-container-x py-section">
        <div className="mx-auto max-w-3xl">
          <SimpleAnimation type="slide-up" delay={0}>
            <h2 className="heading-section mb-8 text-center">Un mot à nous dire ?</h2>
          </SimpleAnimation>

          <SimpleAnimation type="fade" delay={100}>
            <ContactForm />
          </SimpleAnimation>
        </div>
      </div>
    </section>
  );
}
