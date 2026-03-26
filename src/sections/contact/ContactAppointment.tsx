import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import { CALENDLY_URL } from '@/config/endpoints';

export default function ContactAppointment() {
  return (
    <section
      id="rendez-vous"
      className="relative flex min-h-screen w-full flex-col bg-accent"
      data-navbar-theme="dark"
    >
      <div className="mx-auto max-w-container px-container-x py-section">
        <div className="mx-auto max-w-5xl">
          <SimpleAnimation type="slide-up" delay={0}>
            <h2
              className="text-heading mb-6 text-center text-black"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 8rem)', lineHeight: '0.95' }}
            >
              PRENEZ RENDEZ-VOUS
            </h2>
          </SimpleAnimation>

          <SimpleAnimation type="slide-up" delay={100}>
            <p className="mb-10 text-center text-body-lg text-black/50">
              Examen de vue, essayage ou juste un conseil — réservez votre créneau.
            </p>
          </SimpleAnimation>

          <SimpleAnimation type="fade" delay={200}>
            <div
              className="relative w-full overflow-hidden rounded-sm"
              style={{ minHeight: '700px' }}
            >
              <iframe
                src={CALENDLY_URL}
                width="100%"
                height="700"
                style={{ border: 'none' }}
                title="Prendre rendez-vous avec La Lunetterie du Coin"
                className="calendly-inline-widget"
              />
            </div>
          </SimpleAnimation>
        </div>
      </div>
    </section>
  );
}
