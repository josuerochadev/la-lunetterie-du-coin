import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import SectionContainer from '@/components/common/SectionContainer';
import { CALENDLY_URL } from '@/config/constants';

/**
 * ContactAppointment - Section prise de rendez-vous Calendly
 */
export default function ContactAppointment() {
  return (
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
  );
}
