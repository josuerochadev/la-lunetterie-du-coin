import { SimpleAnimation } from '@/components/motion/SimpleAnimation';

/**
 * Section OffersHero - Hero de la page Offres
 *
 * Hero section avec titre et description.
 * Style cohérent avec HomePage et AboutPage.
 *
 * @component
 * @returns {JSX.Element} Hero section pour la page Offres
 */
export default function OffersHero() {
  return (
    <section id="hero" className="relative w-full bg-background py-section">
      <div className="mx-auto max-w-container px-container-x">
        <div className="mx-auto max-w-5xl">
          <SimpleAnimation type="slide-up" delay={0}>
            <div className="space-y-6">
              <h1 className="heading-page">Nos offres</h1>
              <p
                className="leading-relaxed text-stone"
                style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}
              >
                Des solutions pensées pour votre budget et pour la planète
              </p>
            </div>
          </SimpleAnimation>
        </div>
      </div>
    </section>
  );
}
