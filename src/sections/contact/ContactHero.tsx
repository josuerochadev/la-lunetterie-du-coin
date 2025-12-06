import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import SectionContainer from '@/components/common/SectionContainer';

/**
 * ContactHero - Section hero de la page contact
 */
export default function ContactHero() {
  return (
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
  );
}
