import { SimpleAnimation } from '@/components/motion/SimpleAnimation';

/**
 * Section Hero de la page À propos
 *
 * Titre principal et tagline de la page.
 *
 * @component
 * @returns {JSX.Element} Hero section
 */
export default function AboutHero() {
  return (
    <section id="hero" className="relative w-full bg-background py-section">
      <div className="mx-auto max-w-container px-container-x">
        <div className="mx-auto max-w-6xl">
          <SimpleAnimation type="slide-up" delay={0}>
            <div className="space-y-6">
              <h1 className="heading-page">À propos de La Lunetterie du Coin</h1>
              <p
                className="leading-relaxed text-stone"
                style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}
              >
                Pionnier des lunettes d'occasion à Strasbourg depuis 2016
              </p>
            </div>
          </SimpleAnimation>
        </div>
      </div>
    </section>
  );
}
