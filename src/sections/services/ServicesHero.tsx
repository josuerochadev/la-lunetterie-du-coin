import { SimpleAnimation } from '@/components/motion/SimpleAnimation';

/**
 * Section ServicesHero - Hero de la page Services
 *
 * Hero section avec titre et description.
 * Style cohérent avec HomePage, AboutPage et OffersPage.
 *
 * @component
 * @returns {JSX.Element} Hero section pour la page Services
 */
export default function ServicesHero() {
  return (
    <section id="hero" className="relative w-full bg-background py-section">
      <div className="mx-auto max-w-container px-container-x">
        <div className="mx-auto max-w-5xl">
          <SimpleAnimation type="slide-up" delay={0}>
            <div className="space-y-6">
              <h1 className="heading-page">Nos services</h1>
              <p
                className="leading-relaxed text-stone"
                style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}
              >
                Une expertise complète pour prendre soin de votre vue, avec style et conscience
              </p>
            </div>
          </SimpleAnimation>
        </div>
      </div>
    </section>
  );
}
